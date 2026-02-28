const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Load KaraFun catalogue
let karafunSongs = [];
const csvPath = path.join(__dirname, 'data/karafuncatalog.csv');

fs.createReadStream(csvPath)
  .pipe(csv({ separator: ';' }))
  .on('data', (row) => {
    karafunSongs.push({
      id: row['Id'],
      title: row['Title'],
      artist: row['Artist'],
      year: row['Year'],
      duo: row['Duo'] === '1',
      explicit: row['Explicit'] === '1',
      styles: row['Styles'],
      languages: row['Languages'],
      source: 'karafun'
    });
  })
  .on('end', () => {
    console.log(`Loaded ${karafunSongs.length} KaraFun songs`);
  });

// Queue state
let queue = [];
let currentSong = null;
let queueIdCounter = 1;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Catalogue endpoints
let jkCatalogue = null;
let jkPopular = null;
let kfGenres = null;

function loadCatalogues() {
  const dataDir = path.join(__dirname, 'data');

  try {
    jkCatalogue = JSON.parse(fs.readFileSync(path.join(dataDir, 'jkaraokecatalog.json'), 'utf8'));
    console.log(`JKaraoke catalogue: ${jkCatalogue.length} songs`);
  } catch(e) { console.error('JK catalogue error:', e.message); jkCatalogue = []; }

  try {
    jkPopular = JSON.parse(fs.readFileSync(path.join(dataDir, 'jkaraoke-popular.json'), 'utf8'));
    console.log(`JK popular: ${jkPopular.length} songs`);
  } catch(e) { jkPopular = []; }

  try {
    kfGenres = JSON.parse(fs.readFileSync(path.join(dataDir, 'karafun-genres.json'), 'utf8'));
    console.log(`KF genres loaded`);
  } catch(e) { console.error('KF genres error:', e.message); kfGenres = {}; }

  try {
    const artistMap = JSON.parse(fs.readFileSync(path.join(dataDir, 'jkaraoke-artists.json'), 'utf8'));
    jkCatalogue = jkCatalogue.map(s => ({
      ...s,
      artistImage: artistMap[s.artist_id] ? artistMap[s.artist_id].image : null
    }));
    console.log('Artist images applied to catalogue');
  } catch(e) { console.error('Artist image error:', e.message); }
}

loadCatalogues();

app.get('/api/catalogue/jk', (req, res) => res.json(jkCatalogue || []));
app.get('/api/catalogue/jk-popular', (req, res) => res.json(jkPopular || []));
app.get('/api/catalogue/kf-genres', (req, res) => res.json(kfGenres || {}));

// Search KaraFun
app.get('/api/search', (req, res) => {
  const q = (req.query.q || '').toLowerCase().trim();
  const source = req.query.source || 'karafun';

  if (!q || q.length < 2) return res.json([]);

  if (source === 'karafun') {
    const results = karafunSongs.filter(s =>
      s.title.toLowerCase().includes(q) ||
      s.artist.toLowerCase().includes(q)
    ).slice(0, 50);
    return res.json(results);
  }

  // JKaraoke - no catalogue yet, return empty
  res.json([]);
});

// Add to queue
app.post('/api/queue', (req, res) => {
  const { song, singerName } = req.body;
  if (!song || !singerName) return res.status(400).json({ error: 'Missing song or name' });

  const entry = {
    queueId: queueIdCounter++,
    song,
    singerName,
    addedAt: new Date().toISOString(),
    status: 'waiting'
  };

  queue.push(entry);
  io.emit('queue_update', { queue, currentSong });
  res.json({ ok: true, entry });
});

// Get queue
app.get('/api/queue', (req, res) => {
  res.json({ queue, currentSong });
});

// Host actions
app.post('/api/host/next', (req, res) => {
  if (queue.length === 0) return res.json({ ok: true });
  currentSong = queue.shift();
  currentSong.status = 'playing';
  io.emit('queue_update', { queue, currentSong });
  res.json({ ok: true, currentSong });
});

app.post('/api/host/done', (req, res) => {
  currentSong = null;
  io.emit('queue_update', { queue, currentSong });
  res.json({ ok: true });
});

app.post('/api/host/remove/:queueId', (req, res) => {
  const id = parseInt(req.params.queueId);
  queue = queue.filter(e => e.queueId !== id);
  io.emit('queue_update', { queue, currentSong });
  res.json({ ok: true });
});

app.post('/api/host/reorder', (req, res) => {
  const { orderedIds } = req.body;
  const map = {};
  queue.forEach(e => map[e.queueId] = e);
  queue = orderedIds.map(id => map[id]).filter(Boolean);
  io.emit('queue_update', { queue, currentSong });
  res.json({ ok: true });
});

app.post('/api/host/move-up/:queueId', (req, res) => {
  const id = parseInt(req.params.queueId);
  const idx = queue.findIndex(e => e.queueId === id);
  if (idx > 0) {
    [queue[idx - 1], queue[idx]] = [queue[idx], queue[idx - 1]];
    io.emit('queue_update', { queue, currentSong });
  }
  res.json({ ok: true });
});

app.post('/api/host/move-down/:queueId', (req, res) => {
  const id = parseInt(req.params.queueId);
  const idx = queue.findIndex(e => e.queueId === id);
  if (idx >= 0 && idx < queue.length - 1) {
    [queue[idx], queue[idx + 1]] = [queue[idx + 1], queue[idx]];
    io.emit('queue_update', { queue, currentSong });
  }
  res.json({ ok: true });
});

io.on('connection', (socket) => {
  socket.emit('queue_update', { queue, currentSong });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Karaoke server running on http://0.0.0.0:${PORT}`);
  console.log(`Guest page: http://<your-ip>:${PORT}/guest.html`);
  console.log(`Host page:  http://localhost:${PORT}/host.html`);
});

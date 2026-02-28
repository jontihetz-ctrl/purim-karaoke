const https = require('https');
const fs = require('fs');

const OUTPUT_JSON = '../cleo/jkaraokecatalog.json';
const OUTPUT_CSV = '../cleo/jkaraokecatalog.csv';

function fetchPage(page) {
  return new Promise((resolve, reject) => {
    const url = `https://jkaraoke.com/music?page=${page}`;
    const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 15000 }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
  });
}

function extractSongs(html) {
  const match = html.match(/data-page="([^"]+)"/);
  if (!match) return null;
  const json = JSON.parse(match[1].replace(/&quot;/g, '"'));
  return json.props.songs;
}

async function scrapeAll() {
  const allSongs = [];
  let page = 1;
  let hasMore = true;
  let retries = 0;

  while (hasMore) {
    try {
      process.stdout.write(`\rPage ${page} (${allSongs.length} songs)...`);
      const html = await fetchPage(page);
      const data = extractSongs(html);
      
      if (!data || !data.data || data.data.length === 0) {
        hasMore = false;
        break;
      }

      for (const s of data.data) {
        allSongs.push({
          id: s.id,
          title: s.title,
          title_hebrew: s.title_hebrew || '',
          artist: s.artist ? s.artist.name : '',
          artist_id: s.artist ? s.artist.id : null,
          collaborators: (s.collaborating_artists || []).map(a => a.name).join(', '),
          album: s.album ? s.album.title : '',
          year: s.album ? s.album.release_year : null,
          source: 'jkaraoke'
        });
      }

      // Save every 20 pages
      if (page % 20 === 0) {
        fs.writeFileSync(OUTPUT_JSON, JSON.stringify(allSongs));
        process.stdout.write(` [saved]`);
      }

      hasMore = !!data.links.next;
      page++;
      retries = 0;
      await new Promise(r => setTimeout(r, 150));
    } catch (err) {
      retries++;
      console.error(`\nError on page ${page} (attempt ${retries}):`, err.message);
      if (retries >= 3) { hasMore = false; break; }
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  console.log(`\nDone! ${allSongs.length} songs scraped.`);
  
  fs.writeFileSync(OUTPUT_JSON, JSON.stringify(allSongs, null, 2));
  
  const csv = ['id,title,title_hebrew,artist,collaborators,album,year']
    .concat(allSongs.map(s => [
      s.id,
      `"${(s.title || '').replace(/"/g, '""')}"`,
      `"${(s.title_hebrew || '').replace(/"/g, '""')}"`,
      `"${(s.artist || '').replace(/"/g, '""')}"`,
      `"${(s.collaborators || '').replace(/"/g, '""')}"`,
      `"${(s.album || '').replace(/"/g, '""')}"`,
      s.year || ''
    ].join(',')))
    .join('\n');
  
  fs.writeFileSync(OUTPUT_CSV, csv);
  console.log(`Saved to cleo/jkaraokecatalog.json and .csv`);
}

scrapeAll().catch(console.error);

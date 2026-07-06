"use client";

import { useEffect, useState } from "react";

interface Limits {
  dailyUSD: number;
  monthlyUSD: number;
}

export default function SettingsPage() {
  const [targets, setTargets] = useState<string[]>([]);
  const [newNumber, setNewNumber] = useState("");
  const [limits, setLimits] = useState<Limits>({ dailyUSD: 1, monthlyUSD: 10 });
  const [savingLimits, setSavingLimits] = useState(false);
  const [limitsMsg, setLimitsMsg] = useState("");
  const [addMsg, setAddMsg] = useState("");
  const [loading, setLoading] = useState(true);

  async function reload() {
    const [t, sp] = await Promise.all([
      fetch("/api/targets").then((r) => r.json()).catch(() => []),
      fetch("/api/spend").then((r) => r.json()).catch(() => null),
    ]);
    setTargets(t);
    if (sp?.limits) setLimits(sp.limits);
    setLoading(false);
  }

  useEffect(() => { reload(); }, []);

  async function addTarget(e: React.FormEvent) {
    e.preventDefault();
    if (!newNumber.trim()) return;
    const res = await fetch("/api/targets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ number: newNumber.trim() }),
    });
    if (res.ok) {
      setNewNumber("");
      setAddMsg("Added!");
      setTimeout(() => setAddMsg(""), 2000);
      reload();
    } else {
      setAddMsg("Error adding number");
    }
  }

  async function removeTarget(jid: string) {
    await fetch("/api/targets", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jid }),
    });
    reload();
  }

  async function saveLimits(e: React.FormEvent) {
    e.preventDefault();
    setSavingLimits(true);
    const res = await fetch("/api/spend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(limits),
    });
    setSavingLimits(false);
    if (res.ok) {
      setLimitsMsg("Saved!");
      setTimeout(() => setLimitsMsg(""), 2000);
    } else {
      setLimitsMsg("Error saving");
    }
  }

  function formatPhone(jid: string) {
    return "+" + jid.replace("@s.whatsapp.net", "");
  }

  if (loading) return <p className="text-wa-sub">Loading…</p>;

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h2 className="text-xl font-semibold">Settings</h2>

      {/* Target numbers */}
      <div className="card">
        <h3 className="font-semibold mb-1">Target Numbers</h3>
        <p className="text-wa-sub text-xs mb-4">Gerald only replies to numbers on this list. Add scammer numbers in international format (e.g. 27821234567).</p>

        <form onSubmit={addTarget} className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="27821234567"
            value={newNumber}
            onChange={(e) => setNewNumber(e.target.value)}
            className="flex-1 bg-wa-input border border-wa-border rounded-lg px-3 py-2 text-sm text-wa-text placeholder:text-wa-sub focus:outline-none focus:border-wa-green"
          />
          <button
            type="submit"
            className="bg-wa-green text-wa-bg font-semibold text-sm px-4 rounded-lg hover:opacity-90 transition-opacity"
          >
            Add
          </button>
        </form>
        {addMsg && <p className="text-wa-green text-xs mb-3">{addMsg}</p>}

        {targets.length === 0 && (
          <p className="text-wa-sub text-sm text-center py-4">No targets yet.</p>
        )}
        <div className="space-y-2">
          {targets.map((jid) => (
            <div key={jid} className="flex items-center justify-between bg-wa-input rounded-lg px-3 py-2">
              <span className="text-sm font-mono">{formatPhone(jid)}</span>
              <button
                onClick={() => removeTarget(jid)}
                className="text-xs text-red-400 hover:text-red-300 transition-colors"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Spending limits */}
      <div className="card">
        <h3 className="font-semibold mb-1">Spending Limits</h3>
        <p className="text-wa-sub text-xs mb-4">Bot stops replying when either limit is hit. Resets automatically at midnight / month end.</p>
        <form onSubmit={saveLimits} className="space-y-3">
          <div>
            <label className="text-sm text-wa-sub block mb-1">Daily limit (USD)</label>
            <input
              type="number"
              step="0.50"
              min="0.50"
              max="50"
              value={limits.dailyUSD}
              onChange={(e) => setLimits((l) => ({ ...l, dailyUSD: parseFloat(e.target.value) }))}
              className="bg-wa-input border border-wa-border rounded-lg px-3 py-2 text-sm text-wa-text w-full focus:outline-none focus:border-wa-green"
            />
          </div>
          <div>
            <label className="text-sm text-wa-sub block mb-1">Monthly limit (USD)</label>
            <input
              type="number"
              step="1"
              min="1"
              max="200"
              value={limits.monthlyUSD}
              onChange={(e) => setLimits((l) => ({ ...l, monthlyUSD: parseFloat(e.target.value) }))}
              className="bg-wa-input border border-wa-border rounded-lg px-3 py-2 text-sm text-wa-text w-full focus:outline-none focus:border-wa-green"
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={savingLimits}
              className="bg-wa-green text-wa-bg font-semibold text-sm px-5 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {savingLimits ? "Saving…" : "Save limits"}
            </button>
            {limitsMsg && <span className="text-wa-green text-sm">{limitsMsg}</span>}
          </div>
        </form>
      </div>

      {/* VPS deploy info */}
      <div className="card">
        <h3 className="font-semibold mb-2">Bot Deployment</h3>
        <p className="text-wa-sub text-xs mb-3">Run these commands on your VPS to deploy or restart the bot.</p>
        <div className="bg-wa-input rounded-lg p-3 font-mono text-xs text-wa-text space-y-1 overflow-x-auto">
          <p className="text-wa-sub"># First time setup</p>
          <p>cd /root/whatsapp-scambait && npm install</p>
          <p>echo &quot;OPENAI_API_KEY=sk-your-key&quot; &gt; .env</p>
          <p>pm2 start npm --name gerald -- run start:prod</p>
          <p>pm2 save &amp;&amp; pm2 startup</p>
          <div className="border-t border-wa-border my-2" />
          <p className="text-wa-sub"># Restart after update</p>
          <p>pm2 restart gerald</p>
        </div>
      </div>
    </div>
  );
}

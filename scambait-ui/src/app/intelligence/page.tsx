"use client";

import { useEffect, useState } from "react";

interface TagCount { tag: string; count: number }
interface Stats {
  total_signals: number;
  unique_scammers: number;
  top_tags: TagCount[];
  by_escalation: Record<string, number>;
  error?: string;
}

const TAG_LABELS: Record<string, string> = {
  romance_opening: "Romance opening",
  frozen_inheritance: "Frozen inheritance",
  stranded_serviceman: "Stranded serviceman",
  urgent_medical: "Urgent medical",
  customs_fee: "Customs fee",
  investment_opportunity: "Investment opportunity",
  gift_card_request: "Gift card request 🎁",
  crypto_request: "Crypto request ₿",
  bank_transfer_request: "Bank transfer request",
  sob_story_general: "Sob story",
  identity_verification_request: "Identity verification",
  photo_request: "Photo request",
};

const ESCALATION_COLOR: Record<string, string> = {
  low: "text-wa-green",
  medium: "text-yellow-400",
  high: "text-red-400",
};

function TagBar({ tag, count, max }: { tag: string; count: number; max: number }) {
  const pct = Math.round((count / max) * 100);
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-wa-sub w-52 shrink-0 truncate">{TAG_LABELS[tag] ?? tag}</span>
      <div className="flex-1 bg-wa-input rounded-full h-2 overflow-hidden">
        <div className="h-full bg-wa-green rounded-full" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-sm font-mono w-6 text-right">{count}</span>
    </div>
  );
}

export default function IntelligencePage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    const data = await fetch("/api/signals").then((r) => r.json()).catch(() => null);
    setStats(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
    const t = setInterval(load, 60000);
    return () => clearInterval(t);
  }, []);

  const maxTagCount = stats?.top_tags?.[0]?.count ?? 1;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Guardian Net Intelligence</h2>
          <p className="text-wa-sub text-sm mt-0.5">Anonymized scam signal database — Phase 0</p>
        </div>
        <button onClick={load} className="text-xs text-wa-sub hover:text-wa-text">↻ Refresh</button>
      </div>

      {loading && <p className="text-wa-sub">Loading…</p>}

      {stats?.error && (
        <div className="card border-yellow-500/30 bg-yellow-500/10">
          <p className="text-yellow-400 text-sm font-semibold mb-1">⚠ Guardian Net offline</p>
          <p className="text-wa-sub text-xs">{stats.error}</p>
          <p className="text-wa-sub text-xs mt-2">Make sure SIGNAL_SALT is set in .env and the bot is running.</p>
        </div>
      )}

      {stats && !stats.error && (
        <>
          {/* Overview */}
          <div className="grid grid-cols-3 gap-4">
            <div className="card text-center">
              <p className="text-3xl font-bold text-wa-green">{stats.total_signals}</p>
              <p className="text-wa-sub text-sm mt-1">Total signals</p>
            </div>
            <div className="card text-center">
              <p className="text-3xl font-bold text-wa-green">{stats.unique_scammers}</p>
              <p className="text-wa-sub text-sm mt-1">Unique scammers</p>
            </div>
            <div className="card text-center">
              <p className="text-3xl font-bold text-red-400">{stats.by_escalation?.high ?? 0}</p>
              <p className="text-wa-sub text-sm mt-1">High risk</p>
            </div>
          </div>

          {/* Escalation breakdown */}
          <div className="card">
            <h3 className="font-semibold mb-4">Escalation Levels</h3>
            <div className="flex gap-6">
              {["low", "medium", "high"].map((level) => (
                <div key={level} className="flex-1 text-center">
                  <p className={`text-2xl font-bold ${ESCALATION_COLOR[level]}`}>
                    {stats.by_escalation?.[level] ?? 0}
                  </p>
                  <p className="text-wa-sub text-xs mt-1 capitalize">{level}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Top script tags */}
          <div className="card">
            <h3 className="font-semibold mb-4">Top Script Tags</h3>
            {stats.top_tags.length === 0 ? (
              <p className="text-wa-sub text-sm">No tags yet — add a target and let Gerald chat.</p>
            ) : (
              <div className="space-y-3">
                {stats.top_tags.map(({ tag, count }) => (
                  <TagBar key={tag} tag={tag} count={count} max={maxTagCount} />
                ))}
              </div>
            )}
          </div>

          {/* Privacy note */}
          <div className="card border-wa-green/20 bg-wa-green/5">
            <p className="text-xs text-wa-sub">
              <span className="text-wa-green font-semibold">Privacy:</span> signals.db stores only SHA256-salted contact hashes — no raw phone numbers, no conversation text, no images. Safe in principle to share. Phase 1 (public risk-check API) comes after validating this data.
            </p>
          </div>
        </>
      )}
    </div>
  );
}

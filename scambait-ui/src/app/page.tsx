"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Status {
  connected: boolean;
  phone?: string | null;
  connectedAt?: string | null;
  lastMessageAt?: string | null;
  error?: string;
}

interface SpendData {
  today: number;
  month: number;
  lifetime: number;
  limits: { dailyUSD: number; monthlyUSD: number };
  error?: string;
}

interface QRData {
  dataUrl?: string | null;
}

interface ConvoSummary {
  jid: string;
  messageCount: number;
}

function SpendBar({ value, limit, label }: { value: number; limit: number; label: string }) {
  const pct = Math.min((value / limit) * 100, 100);
  const color = pct > 80 ? "bg-red-500" : pct > 50 ? "bg-yellow-400" : "bg-wa-green";
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-wa-sub">{label}</span>
        <span>
          <span className="font-mono">${value.toFixed(4)}</span>
          <span className="text-wa-sub"> / ${limit.toFixed(2)}</span>
        </span>
      </div>
      <div className="spend-bar">
        <div className={`spend-bar-fill ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function Dashboard() {
  const [status, setStatus] = useState<Status | null>(null);
  const [spend, setSpend] = useState<SpendData | null>(null);
  const [qr, setQr] = useState<QRData | null>(null);
  const [convos, setConvos] = useState<ConvoSummary[]>([]);
  const [totalMessages, setTotalMessages] = useState(0);

  async function fetchAll() {
    const [s, sp, q, c] = await Promise.all([
      fetch("/api/status").then((r) => r.json()).catch(() => ({ connected: false })),
      fetch("/api/spend").then((r) => r.json()).catch(() => null),
      fetch("/api/qr").then((r) => r.json()).catch(() => null),
      fetch("/api/conversations").then((r) => r.json()).catch(() => []),
    ]);
    setStatus(s);
    setSpend(sp);
    setQr(q);
    setConvos(c);
    setTotalMessages(c.reduce((sum: number, cv: ConvoSummary) => sum + cv.messageCount, 0));
  }

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 30000);
    return () => clearInterval(interval);
  }, []);

  const isConnected = status?.connected;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Dashboard</h2>
        <button onClick={fetchAll} className="text-xs text-wa-sub hover:text-wa-text transition-colors">
          ↻ Refresh
        </button>
      </div>

      {/* Connection status */}
      <div className="card flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-8">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`w-3 h-3 rounded-full ${isConnected ? "bg-wa-green animate-pulse" : "bg-red-500"}`} />
            <span className="font-semibold">{isConnected ? "Connected" : "Disconnected"}</span>
          </div>
          {isConnected && status?.phone && (
            <p className="text-wa-sub text-sm">+{status.phone}</p>
          )}
          {isConnected && status?.connectedAt && (
            <p className="text-wa-sub text-sm">Since {timeAgo(status.connectedAt)}</p>
          )}
          {isConnected && status?.lastMessageAt && (
            <p className="text-wa-sub text-sm">Last activity {timeAgo(status.lastMessageAt)}</p>
          )}
          {!isConnected && (
            <p className="text-wa-sub text-sm mt-1">
              {qr?.dataUrl ? "Scan the QR code to connect WhatsApp →" : "Start the bot on VPS to get a QR code"}
            </p>
          )}
        </div>

        {qr?.dataUrl && !isConnected && (
          <div className="shrink-0">
            <p className="text-xs text-wa-sub mb-2 text-center">Scan with burner WhatsApp</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qr.dataUrl} alt="WhatsApp QR code" width={200} height={200} className="rounded-lg" />
          </div>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card text-center">
          <p className="text-3xl font-bold text-wa-green">{convos.length}</p>
          <p className="text-wa-sub text-sm mt-1">Conversations</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-wa-green">{totalMessages}</p>
          <p className="text-wa-sub text-sm mt-1">Messages sent</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-wa-green">${spend?.lifetime.toFixed(3) ?? "—"}</p>
          <p className="text-wa-sub text-sm mt-1">Lifetime cost</p>
        </div>
      </div>

      {/* Spend */}
      {spend && (
        <div className="card space-y-4">
          <h3 className="font-semibold">Spending</h3>
          <SpendBar value={spend.today} limit={spend.limits.dailyUSD} label="Today" />
          <SpendBar value={spend.month} limit={spend.limits.monthlyUSD} label="This month" />
          <p className="text-xs text-wa-sub">Limits adjustable in Settings · Powered by gpt-4o-mini (~$0.04/conversation)</p>
        </div>
      )}

      {/* Opening message card */}
      <div className="card">
        <h3 className="font-semibold mb-2">Gerald&apos;s Opening Message</h3>
        <p className="text-xs text-wa-sub mb-3">Copy this when you first message a scammer from your burner number. Gerald takes over after they reply.</p>
        <div className="bg-wa-input rounded-lg p-3 text-sm text-wa-text font-mono leading-relaxed select-all border border-wa-border">
          Hi, sorry to bother — not sure if I have the right number? My name&apos;s Gerald. Someone in my widows and widowers support group (Margaret set it all up on my phone) gave me your contact, said you might be going through a similar time to me. I lost my wife 8 months back. If I&apos;ve got the wrong person no worries at all, sorry to disturb!
        </div>
        <p className="text-xs text-wa-sub mt-2">This gives you a clean backstory with zero link to whoever the scammer originally targeted.</p>
      </div>
    </div>
  );
}

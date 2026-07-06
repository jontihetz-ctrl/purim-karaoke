"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface ConvoSummary {
  jid: string;
  phone: string;
  startedAt: string;
  messageCount: number;
  lastMessage: { role: string; content: string; ts: string } | null;
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

function formatPhone(phone: string) {
  return "+" + phone;
}

export default function ChatsPage() {
  const [convos, setConvos] = useState<ConvoSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/conversations")
      .then((r) => r.json())
      .then(setConvos)
      .finally(() => setLoading(false));
    const t = setInterval(() => {
      fetch("/api/conversations").then((r) => r.json()).then(setConvos);
    }, 30000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-6">Conversations</h2>
      {loading && <p className="text-wa-sub">Loading…</p>}
      {!loading && convos.length === 0 && (
        <div className="card text-center py-12">
          <p className="text-4xl mb-3">💤</p>
          <p className="text-wa-sub">No conversations yet.</p>
          <p className="text-wa-sub text-sm mt-1">Add a target in Settings and send Gerald&apos;s opening message.</p>
        </div>
      )}
      <div className="space-y-2">
        {convos.map((c) => (
          <Link
            key={c.jid}
            href={`/chats/${encodeURIComponent(c.jid)}`}
            className="card flex items-center gap-4 hover:border-wa-green transition-colors cursor-pointer block"
          >
            <div className="w-10 h-10 rounded-full bg-wa-input flex items-center justify-center text-lg shrink-0">
              🤡
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-medium">{formatPhone(c.phone)}</span>
                <span className="text-xs text-wa-sub">
                  {c.lastMessage?.ts ? timeAgo(c.lastMessage.ts) : timeAgo(c.startedAt)}
                </span>
              </div>
              <p className="text-sm text-wa-sub truncate mt-0.5">
                {c.lastMessage
                  ? `${c.lastMessage.role === "assistant" ? "Gerald: " : "Scammer: "}${c.lastMessage.content}`
                  : "No messages yet"}
              </p>
            </div>
            <div className="text-xs text-wa-sub shrink-0">
              {c.messageCount} msgs
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

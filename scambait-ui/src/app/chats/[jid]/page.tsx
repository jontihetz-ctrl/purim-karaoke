"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

interface Message {
  role: "user" | "assistant";
  content: string;
  ts: string;
}

interface Convo {
  jid: string;
  startedAt: string;
  messages: Message[];
}

function formatPhone(jid: string) {
  return "+" + jid.replace("@s.whatsapp.net", "");
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDate(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  if (d.toDateString() === today.toDateString()) return "Today";
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString([], { day: "numeric", month: "short", year: "numeric" });
}

export default function ChatPage({ params }: { params: { jid: string } }) {
  const jid = decodeURIComponent(params.jid);
  const [convo, setConvo] = useState<Convo | null>(null);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  async function load() {
    const data = await fetch(`/api/conversations/${encodeURIComponent(jid)}`).then((r) => r.json());
    setConvo(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
    const t = setInterval(load, 15000);
    return () => clearInterval(t);
  }, [jid]); // eslint-disable-line

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [convo?.messages.length]);

  if (loading) return <p className="text-wa-sub">Loading…</p>;
  if (!convo) return (
    <div className="text-center mt-20">
      <p className="text-wa-sub">Conversation not found.</p>
      <Link href="/chats" className="text-wa-green hover:underline text-sm mt-2 inline-block">← Back to chats</Link>
    </div>
  );

  // Group messages by date for separators
  let lastDate = "";

  return (
    <div className="max-w-2xl mx-auto flex flex-col h-[calc(100vh-80px)]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-wa-border">
        <Link href="/chats" className="text-wa-sub hover:text-wa-text transition-colors">←</Link>
        <div className="w-9 h-9 rounded-full bg-wa-input flex items-center justify-center">🤡</div>
        <div>
          <p className="font-medium">{formatPhone(jid)}</p>
          <p className="text-xs text-wa-sub">{convo.messages.length} messages</p>
        </div>
        <button onClick={load} className="ml-auto text-xs text-wa-sub hover:text-wa-text">↻</button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-1 pr-1">
        {convo.messages.map((msg, i) => {
          const dateStr = formatDate(msg.ts);
          const showDate = dateStr !== lastDate;
          lastDate = dateStr;
          const isGerald = msg.role === "assistant";

          return (
            <div key={i}>
              {showDate && (
                <div className="flex justify-center my-4">
                  <span className="bg-wa-input text-wa-sub text-xs px-3 py-1 rounded-full">{dateStr}</span>
                </div>
              )}
              <div className={`flex ${isGerald ? "justify-end" : "justify-start"} mb-1`}>
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                    isGerald
                      ? "bg-wa-green-msg text-white rounded-tr-sm"
                      : "bg-wa-gray-msg text-wa-text rounded-tl-sm border border-wa-border"
                  }`}
                >
                  {!isGerald && (
                    <p className="text-xs font-semibold text-red-400 mb-0.5">Scammer</p>
                  )}
                  {isGerald && (
                    <p className="text-xs font-semibold text-wa-green mb-0.5">Gerald</p>
                  )}
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  <p className={`text-xs mt-1 ${isGerald ? "text-green-300/70" : "text-wa-sub"} text-right`}>
                    {formatTime(msg.ts)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

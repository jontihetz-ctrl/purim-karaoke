"use client";
import { useState, useEffect, useCallback } from "react";

type Item = {
  queue_id: number;
  image_id: number;
  image_url: string;
  commenter: string;
  language: string;
  script: string;
  transcription: string;
  source: string;
  post_text: string;
  post_date: string;
};

export default function ReviewPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [idx, setIdx] = useState(0);
  const [done, setDone] = useState<Record<number, "approve" | "reject" | "skip">>({});
  const [saving, setSaving] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [transcription, setTranscription] = useState("");

  useEffect(() => {
    fetch("/pending.json")
      .then((r) => r.json())
      .then((data: Item[]) => {
        setItems(data);
        if (data[0]) setTranscription(data[0].transcription || "");
      });
  }, []);

  const current = items[idx];

  useEffect(() => {
    setImgError(false);
    if (current) setTranscription(current.transcription || "");
  }, [idx, current]);

  const decide = useCallback(
    async (action: "approve" | "reject" | "skip") => {
      if (!current || saving) return;
      setSaving(true);
      try {
        await fetch("/api/review", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            queue_id: current.queue_id,
            action,
            transcription: action === "approve" ? transcription : undefined,
          }),
        });
        setDone((d) => ({ ...d, [current.queue_id]: action }));
        setIdx((i) => i + 1);
      } finally {
        setSaving(false);
      }
    },
    [current, saving, transcription]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "y" || e.key === "Y") decide("approve");
      if (e.key === "n" || e.key === "N") decide("reject");
      if (e.key === "s" || e.key === "S") decide("skip");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [decide]);

  const approved = Object.values(done).filter((v) => v === "approve").length;
  const rejected = Object.values(done).filter((v) => v === "reject").length;

  if (!items.length) {
    return (
      <div className="min-h-screen bg-[#111] text-[#eee] flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (idx >= items.length) {
    return (
      <div className="min-h-screen bg-[#111] text-[#eee] flex flex-col items-center justify-center gap-4">
        <h1 className="text-3xl text-[#f5c842]">All done!</h1>
        <p className="text-gray-400">
          Approved: {approved} · Rejected: {rejected} · Total reviewed: {idx}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111] text-[#eee] flex flex-col">
      {/* Header */}
      <div className="bg-[#1a1208] border-b border-[#333] px-6 py-3 flex items-center gap-6">
        <h1 className="text-[#f5c842] font-semibold">✉️ Postcard Review</h1>
        <span className="text-sm text-gray-400">
          {idx + 1} / {items.length} · ✓ {approved} · ✗ {rejected}
        </span>
        <span className="text-xs text-gray-600 ml-auto">
          Y = approve · N = reject · S = skip
        </span>
      </div>

      {/* Main */}
      <div className="flex flex-1 overflow-hidden">
        {/* Image */}
        <div className="w-1/2 border-r border-[#333] overflow-auto p-4 flex flex-col gap-3">
          {imgError ? (
            <div className="bg-[#1c1c1c] rounded-lg p-8 text-center text-gray-500">
              Image not available
            </div>
          ) : (
            <img
              src={current.image_url}
              alt="postcard"
              className="max-w-full rounded-lg border border-[#333]"
              onError={() => setImgError(true)}
            />
          )}
          {current.post_text && (
            <div>
              <label className="text-[10px] uppercase tracking-widest text-gray-500 block mb-1">
                Post caption
              </label>
              <div className="bg-[#1c1c1c] rounded p-2 text-xs text-gray-400 whitespace-pre-wrap">
                {current.post_text.slice(0, 300)}
              </div>
            </div>
          )}
          <div className="text-xs text-gray-600">
            Source: {current.source} · {current.post_date || "unknown date"} ·
            Commenter: {current.commenter || "—"}
          </div>
        </div>

        {/* Data + actions */}
        <div className="w-1/2 overflow-auto p-6 flex flex-col gap-5">
          <div>
            <label className="text-[10px] uppercase tracking-widest text-gray-500 block mb-1">
              Language
            </label>
            <span
              className={`inline-block px-2 py-0.5 rounded text-xs mr-2 ${
                current.language === "yiddish"
                  ? "bg-[#2a1f00] text-[#f5c842]"
                  : current.language === "russian"
                  ? "bg-[#001f2a] text-[#42c8f5]"
                  : "bg-[#222] text-gray-400"
              }`}
            >
              {current.language}
            </span>
            <span className="inline-block px-2 py-0.5 rounded text-xs bg-[#222] text-gray-400">
              {current.script} script
            </span>
          </div>

          <div className="flex-1">
            <label className="text-[10px] uppercase tracking-widest text-gray-500 block mb-1">
              Transcription / comment
            </label>
            <textarea
              className="w-full bg-[#1c1c1c] border border-[#333] text-[#eee] rounded p-3 text-sm resize-none focus:outline-none focus:border-[#555]"
              rows={10}
              dir={current.script === "hebrew" ? "rtl" : "ltr"}
              value={transcription}
              onChange={(e) => setTranscription(e.target.value)}
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => decide("approve")}
              disabled={saving}
              className="flex-1 py-3 rounded-lg bg-[#2d6a2d] hover:bg-[#3a8a3a] text-white font-semibold disabled:opacity-50 transition-colors"
            >
              ✓ Approve (Y)
            </button>
            <button
              onClick={() => decide("reject")}
              disabled={saving}
              className="flex-1 py-3 rounded-lg bg-[#6a2d2d] hover:bg-[#8a3a3a] text-white font-semibold disabled:opacity-50 transition-colors"
            >
              ✗ Reject (N)
            </button>
            <button
              onClick={() => decide("skip")}
              disabled={saving}
              className="px-5 py-3 rounded-lg bg-[#333] hover:bg-[#444] text-gray-300 font-semibold disabled:opacity-50 transition-colors"
            >
              Skip (S)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

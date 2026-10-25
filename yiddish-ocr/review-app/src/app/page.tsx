"use client";
import { useState, useEffect, useCallback } from "react";

type Item = {
  queue_id: number;
  image_id: number;
  image_url: string | null;
  fb_photo_url: string | null;
  post_url: string | null;
  commenter: string;
  language: string;
  script: string;
  transcription: string;
  source: string;
  post_date: string;
};

type Decision = {
  queue_id: number;
  action: "approve" | "reject" | "skip";
  transcription?: string;
};

const STORAGE_KEY = "postcard_review_decisions";

export default function ReviewPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [idx, setIdx] = useState(0);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [imgError, setImgError] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [loadError, setLoadError] = useState("");

  // Load items and saved progress
  useEffect(() => {
    fetch("/pending.json")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data: Item[]) => {
        setItems(data);
        try {
          const saved = localStorage.getItem(STORAGE_KEY);
          if (saved) {
            const savedDecisions: Decision[] = JSON.parse(saved);
            setDecisions(savedDecisions);
            const reviewedIds = new Set(savedDecisions.filter(d => d.action !== "skip").map((d) => d.queue_id));
            const nextUnreviewed = data.findIndex((item) => !reviewedIds.has(item.queue_id));
            setIdx(nextUnreviewed >= 0 ? nextUnreviewed : data.length);
          }
        } catch {
          // localStorage unavailable — start fresh
        }
      })
      .catch((e) => setLoadError(String(e)));
  }, []);

  const current = items[idx];

  useEffect(() => {
    setImgError(false);
    if (current) setTranscription(current.transcription || "");
  }, [idx, current]);

  const decide = useCallback(
    (action: "approve" | "reject" | "skip") => {
      if (!current) return;
      const decision: Decision = {
        queue_id: current.queue_id,
        action,
        transcription: action === "approve" ? transcription : undefined,
      };
      setDecisions((prev) => {
        const next = [...prev.filter((d) => d.queue_id !== current.queue_id), decision];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      });
      setIdx((i) => i + 1);
    },
    [current, transcription]
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

  const downloadDecisions = () => {
    const blob = new Blob([JSON.stringify(decisions, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "review_decisions.json";
    a.click();
  };

  const approved = decisions.filter((d) => d.action === "approve").length;
  const rejected = decisions.filter((d) => d.action === "reject").length;
  const total = decisions.filter((d) => d.action !== "skip").length;

  if (loadError) {
    return (
      <div className="min-h-screen bg-[#111] text-[#eee] flex flex-col items-center justify-center gap-3">
        <p className="text-red-400">Failed to load review items</p>
        <p className="text-gray-600 text-sm">{loadError}</p>
        <button onClick={() => window.location.reload()} className="px-4 py-2 bg-[#333] rounded text-sm">Retry</button>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="min-h-screen bg-[#111] text-[#eee] flex items-center justify-center">
        <p className="text-gray-500">Loading 165 items...</p>
      </div>
    );
  }

  if (idx >= items.length) {
    return (
      <div className="min-h-screen bg-[#111] text-[#eee] flex flex-col items-center justify-center gap-6">
        <h1 className="text-3xl text-[#f5c842]">All done!</h1>
        <p className="text-gray-400">Approved: {approved} · Rejected: {rejected} · Total: {total}</p>
        <button
          onClick={downloadDecisions}
          className="px-6 py-3 bg-[#2d6a2d] hover:bg-[#3a8a3a] text-white rounded-lg font-semibold"
        >
          ↓ Download decisions JSON
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111] text-[#eee] flex flex-col" style={{ height: "100vh" }}>
      {/* Header */}
      <div className="bg-[#1a1208] border-b border-[#333] px-6 py-3 flex items-center gap-6 shrink-0">
        <h1 className="text-[#f5c842] font-semibold">✉️ Postcard Review</h1>
        <span className="text-sm text-gray-400">
          {idx + 1} / {items.length} · ✓ {approved} · ✗ {rejected}
        </span>
        <span className="text-xs text-gray-600 ml-auto mr-4">Y = approve · N = reject · S = skip</span>
        {decisions.length > 0 && (
          <button
            onClick={downloadDecisions}
            className="text-xs px-3 py-1 bg-[#333] hover:bg-[#444] text-gray-300 rounded"
          >
            ↓ Save progress
          </button>
        )}
      </div>

      {/* Main */}
      <div className="flex flex-1 overflow-hidden">
        {/* Image */}
        <div className="w-1/2 border-r border-[#333] overflow-auto p-4 flex flex-col gap-3">
          {current.image_url && !imgError ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={current.image_url}
              alt="postcard"
              className="max-w-full rounded-lg border border-[#333]"
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="bg-[#1c1c1c] rounded-lg p-8 text-center flex flex-col gap-4 items-center justify-center min-h-[200px]">
              <p className="text-gray-500 text-sm">Image not cached locally</p>
              {(current.fb_photo_url || current.post_url) && (
                <a
                  href={current.fb_photo_url || current.post_url || ""}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-[#1877f2] hover:bg-[#1665d8] text-white rounded-lg text-sm font-medium"
                >
                  View on Facebook →
                </a>
              )}
            </div>
          )}
          <div className="text-xs text-gray-600">
            {current.commenter || "—"} · <a href={current.post_url || ""} target="_blank" rel="noreferrer" className="underline opacity-50 hover:opacity-100">post</a>
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
              Transcription / comment — edit if needed before approving
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
              className="flex-1 py-3 rounded-lg bg-[#2d6a2d] hover:bg-[#3a8a3a] text-white font-semibold transition-colors"
            >
              ✓ Approve (Y)
            </button>
            <button
              onClick={() => decide("reject")}
              className="flex-1 py-3 rounded-lg bg-[#6a2d2d] hover:bg-[#8a3a3a] text-white font-semibold transition-colors"
            >
              ✗ Reject (N)
            </button>
            <button
              onClick={() => decide("skip")}
              className="px-5 py-3 rounded-lg bg-[#333] hover:bg-[#444] text-gray-300 font-semibold transition-colors"
            >
              Skip (S)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

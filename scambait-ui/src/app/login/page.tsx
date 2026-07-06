"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr("");
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pw }),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/");
      router.refresh();
    } else {
      setErr("Wrong password");
      setPw("");
    }
  }

  return (
    <div className="fixed inset-0 bg-wa-bg flex items-center justify-center">
      <div className="w-80 bg-wa-sidebar border border-wa-border rounded-2xl p-8">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🎣</div>
          <h1 className="text-xl font-bold text-wa-text">Gerald Bot</h1>
          <p className="text-wa-sub text-sm mt-1">Scambait Manager</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="password"
            placeholder="Password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            className="bg-wa-input border border-wa-border rounded-lg px-4 py-2.5 text-wa-text placeholder:text-wa-sub focus:outline-none focus:border-wa-green text-sm"
            autoFocus
            autoComplete="current-password"
          />
          {err && <p className="text-red-400 text-sm text-center">{err}</p>}
          <button
            type="submit"
            disabled={loading || !pw}
            className="bg-wa-green text-wa-bg font-semibold rounded-lg py-2.5 hover:opacity-90 transition-opacity disabled:opacity-40 text-sm mt-1"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}

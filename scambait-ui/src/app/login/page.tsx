"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pw }),
    });
    if (res.ok) {
      router.push("/");
      router.refresh();
    } else {
      setErr("Wrong password");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-wa-bg">
      <div className="card w-80">
        <h1 className="text-xl font-bold text-wa-green mb-1">🎣 Gerald Bot</h1>
        <p className="text-wa-sub text-sm mb-6">Sign in to manage your scambait bot</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="password"
            placeholder="Password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            className="bg-wa-input border border-wa-border rounded-lg px-4 py-2 text-wa-text placeholder:text-wa-sub focus:outline-none focus:border-wa-green"
            autoFocus
          />
          {err && <p className="text-red-400 text-sm">{err}</p>}
          <button
            type="submit"
            className="bg-wa-green text-wa-bg font-semibold rounded-lg py-2 hover:opacity-90 transition-opacity"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}

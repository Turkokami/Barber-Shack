"use client";

/**
 * Working contact / interest form.
 *
 * Submits to Web3Forms so the site stays static (no server, no exposed mailbox).
 * The destination inbox is bound to an opaque access key, set at build time via
 * NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY — the shop's email address is NEVER published
 * on the page, which keeps registry #2 / the "don't publish the gmail" rule intact.
 *
 * Until the key is set the form still renders, but explains the one setup step
 * and points to the phone, so it never silently drops a submission.
 */
import { useState } from "react";
import { BUSINESS as B } from "@/content/business";

const ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm({
  topic = "General enquiry",
  heading = "Send us a message",
  intro,
}: {
  topic?: string;
  heading?: string;
  intro?: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!ACCESS_KEY) {
      setStatus("error");
      setError(
        `This form isn't connected yet. Please call ${B.phoneDisplay}, or check back soon.`
      );
      return;
    }

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setStatus("submitting");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          subject: `Barber Shack — ${topic}`,
          from_name: "Barber Shack website",
          topic,
          ...data,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
        setError(json.message || "Something went wrong. Please try again or call the shop.");
      }
    } catch {
      setStatus("error");
      setError("Couldn't reach the server. Please try again or call the shop.");
    }
  }

  if (status === "success") {
    return (
      <div className="border border-chrome/40 bg-paper p-6 my-8 rounded-xl max-w-2xl">
        <p className="eyebrow mb-2">Thanks</p>
        <p className="text-lg">
          Got it — we&apos;ll be in touch. Prefer to talk now?{" "}
          <a href={`tel:${B.phoneTel}`} className="underline underline-offset-4">Call {B.phoneDisplay}</a>.
        </p>
      </div>
    );
  }

  const field =
    "rounded-lg border border-chrome/40 bg-shopwhite px-4 py-2.5 text-ink outline-none focus:border-signal";

  return (
    <form onSubmit={onSubmit} className="border border-chrome/40 bg-paper p-6 my-8 rounded-xl max-w-2xl">
      <p className="eyebrow mb-2">{heading}</p>
      {intro && <p className="mb-4 text-ink/85">{intro}</p>}

      {/* honeypot — bots fill this, humans never see it */}
      <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" />

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="board text-sm font-semibold">Name</span>
          <input name="name" type="text" autoComplete="name" required className={field} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="board text-sm font-semibold">Email</span>
          <input name="email" type="email" autoComplete="email" required className={field} />
        </label>
        <label className="flex flex-col gap-1.5 sm:col-span-2">
          <span className="board text-sm font-semibold">Phone <span className="text-meta font-normal">(optional)</span></span>
          <input name="phone" type="tel" autoComplete="tel" className={field} />
        </label>
        <label className="flex flex-col gap-1.5 sm:col-span-2">
          <span className="board text-sm font-semibold">Message</span>
          <textarea name="message" rows={4} required className={field} />
        </label>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="bg-signal text-white px-7 py-3.5 rounded-lg font-bold uppercase tracking-wide text-sm transition hover:brightness-110 disabled:opacity-60"
        >
          {status === "submitting" ? "Sending…" : "Send message"}
        </button>
        {status === "error" && (
          <p role="alert" className="text-sm text-red-700">{error}</p>
        )}
      </div>
    </form>
  );
}

/**
 * The community thesis, surfaced where it belongs rather than quarantined
 * on an About page. Jared: "community hub first, barbershop second."
 *
 * Tone rule: if this would embarrass the shop at the Autism Walk booth,
 * rewrite it. No marketing register, no charity-as-branding.
 */
import { ROUTES } from "@/lib/routes";

export default function CommunityNote({ children }: { children: React.ReactNode }) {
  return (
    <aside className="border border-steel/40 bg-paper p-6 my-10">
      <p className="eyebrow mb-2">Why we do it this way</p>
      <p className="mb-3">{children}</p>
      <a href={ROUTES.community} className="board text-xs underline underline-offset-4">
        More about what we do in the neighborhood →
      </a>
    </aside>
  );
}

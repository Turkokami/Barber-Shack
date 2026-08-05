/**
 * NAMED-EXPERT E-E-A-T BLOCK — Master Plan on-page contract, block 2.
 *
 * First person, credential shown, same named voice across every page in that
 * specialist's cluster. This is not a staff bio widget — it is an authorship
 * signal, and the license number is the part that makes it one.
 */
import { voiceFor } from "@/content/specialists";
import { ROUTES } from "@/lib/routes";

export default function ExpertBlock({ cluster }: { cluster: string }) {
  const sp = voiceFor(cluster);
  if (!sp) return null;

  return (
    <aside className="border-l-4 border-steel bg-paper px-5 py-5 my-10">
      <p className="eyebrow mb-2">From {sp.firstName}</p>
      <p className="display text-xl">{sp.name}</p>
      <p className="board text-xs text-chrome mt-1">{sp.role}</p>
      <ul className="board text-xs text-chrome mt-2 space-y-0.5">
        {sp.credentials.map((c) => (
          <li key={c.name}>{c.name} · WA #{c.licenseNumber}</li>
        ))}
      </ul>
      <p className="mt-4">{sp.bio}</p>
      <a href={ROUTES.barber(sp.slug)} className="board text-xs underline underline-offset-4 mt-3 inline-block">
        More about {sp.firstName} →
      </a>
    </aside>
  );
}

/**
 * Verified GBP reviews only. NEVER hand-written — Master Plan hard rule.
 * Populated in P4-03 from the P0-02 export.
 */
type Review = { text: string; author: string; rating: number };

export default function ReviewPull({ reviews }: { reviews: Review[] }) {
  if (!reviews.length) return null;
  return (
    <section className="my-12">
      <p className="eyebrow mb-3">From Google</p>
      <div className="grid gap-6 md:grid-cols-2">
        {reviews.map((r) => (
          <blockquote key={r.author} className="border-l-2 border-steel pl-5">
            <p className="mb-2">{r.text}</p>
            <cite className="board text-xs not-italic text-meta">
              {r.author} · {r.rating}★
            </cite>
          </blockquote>
        ))}
      </div>
    </section>
  );
}

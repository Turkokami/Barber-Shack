/**
 * Exactly one FaqBlock per route, feeding exactly one FAQPage node.
 * Two FAQ blocks on one URL is a P0 defect — see the known-failure catalog.
 */
export default function FaqBlock({ faqs }: { faqs: { q: string; a: string }[] }) {
  if (!faqs.length) return null;
  return (
    <section className="my-12">
      <p className="eyebrow mb-3">Questions</p>
      <dl className="border-t border-chrome/40">
        {faqs.map((f) => (
          <div key={f.q} className="border-b border-chrome/40 py-5">
            <dt className="display text-xl mb-2">{f.q}</dt>
            <dd className="text-ink/85">{f.a}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

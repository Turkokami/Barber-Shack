/**
 * THE PRICE BOARD — the site's signature element.
 *
 * The price is the message. It is set as data, on a ruled board, because that
 * is what it is — and because the Tuesday rate is currently invisible at the
 * moment of decision. This component is the visual half of the Offer schema.
 */
type Row = { name: string; price: string; tuesdayPrice?: string; href?: string };

export default function PriceTable({ rows, caption }: { rows: Row[]; caption?: string }) {
  return (
    <section className="my-10">
      {caption && <p className="eyebrow mb-3">{caption}</p>}
      <div className="board border-t-2 border-ink">
        {rows.map((r) => (
          <div key={r.name} className="board-row">
            <span className="font-body text-base">
              {r.href ? <a href={r.href} className="underline underline-offset-4 decoration-chrome">{r.name}</a> : r.name}
            </span>
            <span className="dots" aria-hidden />
            <span className="whitespace-nowrap">
              {r.tuesdayPrice && (
                <span className="text-signal mr-3">Tue ${r.tuesdayPrice}</span>
              )}
              <span className="font-semibold">${r.price}</span>
            </span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-sm text-meta">
        $12 Tuesdays applies to everyone, all day, no qualifying required.
      </p>
    </section>
  );
}

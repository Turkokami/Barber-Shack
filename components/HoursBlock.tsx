import { BUSINESS as B } from "@/content/business";

/** Seven days is a differentiator. Sunday is never omitted or collapsed into "weekends". */
export default function HoursBlock() {
  return (
    <section className="my-10">
      <p className="eyebrow mb-3">Open seven days</p>
      <div className="board border-t-2 border-ink">
        {B.hours.map((h) => (
          <div key={h.day} className="board-row">
            <span>{h.day}</span>
            <span className="dots" aria-hidden />
            <span>{h.opens}–{h.closes}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

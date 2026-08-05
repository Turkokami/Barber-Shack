/** Rendered on every route, matching the URL path exactly and the BreadcrumbList node. */
export default function Breadcrumbs({ crumbs }: { crumbs: { name: string; item: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="board text-xs text-chrome py-4">
      {crumbs.map((c, i) => (
        <span key={c.item}>
          {i > 0 && <span aria-hidden className="mx-2">/</span>}
          {i === crumbs.length - 1
            ? <span aria-current="page">{c.name}</span>
            : <a href={c.item} className="underline underline-offset-4">{c.name}</a>}
        </span>
      ))}
    </nav>
  );
}

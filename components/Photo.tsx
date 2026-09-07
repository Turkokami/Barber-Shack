/**
 * Photo — one place for on-page imagery. next/image, WebP, lazy by default,
 * always with descriptive alt text (acceptance gate). Optional caption in the
 * shop's own voice, because a caption is where a page stops sounding like a brochure.
 */
import Image from "next/image";

export default function Photo({
  src,
  alt,
  caption,
  ratio = "aspect-[4/3]",
  className = "",
  priority = false,
  sizes = "(min-width: 768px) 44rem, 100vw",
}: {
  src: string;
  alt: string;
  caption?: string;
  ratio?: string;
  className?: string;
  priority?: boolean;
  /** Must match the rendered width. A slot narrower than the default should say
   *  so, or next/image ships a bigger file than the slot can ever show. */
  sizes?: string;
}) {
  return (
    <figure className={`m-0 ${className}`}>
      <div className={`relative ${ratio} w-full bg-paper border border-chrome/30 overflow-hidden rounded-lg`}>
        <Image src={src} alt={alt} fill priority={priority} sizes={sizes} className="object-cover" />
      </div>
      {caption && <figcaption className="board text-xs text-meta mt-2">{caption}</figcaption>}
    </figure>
  );
}

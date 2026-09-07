/**
 * GALLERY — the work and the room. All imagery is used with permission
 * (legacy social posts, owner-confirmed). Every image carries descriptive alt
 * text; no meaning-carrying text is baked into a page image (Hard Prohibition #10).
 */
import type { Metadata } from "next";
import Image from "next/image";
import { BUSINESS as B } from "@/content/business";
import { ROUTES, abs, BRAND } from "@/lib/routes";
import { pageGraph } from "@/lib/schema";
import JsonLd from "@/components/JsonLd";
import Breadcrumbs from "@/components/Breadcrumbs";
import AnswerBox from "@/components/AnswerBox";
import CtaBar from "@/components/CtaBar";

export const metadata: Metadata = {
  title: "Gallery — Barber Shack Bellingham",
  description:
    "Cuts, fades, and shaves from the chair, plus a look inside Barber Shack in Bellingham — the shop floor, the barber pole, and the work behind the $12 Tuesday.",
  alternates: { canonical: abs(ROUTES.gallery) },
};

const ANSWER =
  "Cuts, fades, and shaves from the chair at Barber Shack, plus a look inside the shop at 2500 " +
  "Cedarwood Ave in Bellingham — the floor, the barber pole, and the work behind the community " +
  "programs and the $12 Tuesday.";

type Shot = { src: string; alt: string; ratio?: string };

const CHAIR: Shot[] = [
  { src: "/images/cut-pompadour.webp", alt: "A fresh side-part pompadour cut and styled at Barber Shack, in front of the BS logo wall." },
  { src: "/images/cut-fade-comb.webp", alt: "A fade taken down with clipper and comb on a client at Barber Shack in Bellingham." },
  { src: "/images/cut-kids2.webp", alt: "A young client's finished cut with a razored side design at Barber Shack." },
  { src: "/images/cut-clipper-closeup.webp", alt: "Clippers detailing the side of a client's cut at Barber Shack." },
  { src: "/images/chair-scissor-bw.webp", alt: "Owner and master barber Jared Jones-Valentine scissor-cutting a client at Barber Shack, in black and white." },
  { src: "/images/cut-fresh-fade.webp", alt: "A crisp, freshly finished fade at Barber Shack." },
  { src: "/images/shave-bw.webp", alt: "A traditional hot-towel straight-razor shave at Barber Shack, in black and white." },
  { src: "/images/cut-locs.webp", alt: "Healthy, maintained locs — textured hair care at Barber Shack." },
  { src: "/images/cut-braids.webp", alt: "Medium knotless braids styled at Barber Shack." },
  { src: "/images/cut-beard.webp", alt: "A full beard shaped and detailed at Barber Shack." },
  { src: "/images/cut-lineup.webp", alt: "A sharp line-up and fresh cut at Barber Shack." },
  { src: "/images/cut-hairart.webp", alt: "Custom hair-art design razored into a cut at Barber Shack." },
  { src: "/images/cut-fade-comb2.webp", alt: "Clipper-over-comb work shaping a client's fade at Barber Shack." },
  { src: "/images/cut-clipper2.webp", alt: "A clean clipper cut in the chair at Barber Shack." },
  { src: "/images/cut-beard2.webp", alt: "A full beard trimmed and shaped at Barber Shack." },
  { src: "/images/cut-locs2.webp", alt: "Long, healthy locs cared for at Barber Shack." },
  { src: "/images/cut-kids-chair.webp", alt: "A young client getting a cut in the chair at Barber Shack." },
  { src: "/images/cut-fade-nape.webp", alt: "A tapered fade blended down to the nape, finished at Barber Shack." },
  { src: "/images/cut-fade-top.webp", alt: "A short fade seen from above, edges cleaned up at Barber Shack." },
  { src: "/images/shave-cream.webp", alt: "A client lathered up for a straight-razor shave at Barber Shack." },
  { src: "/images/cut-fade-back.webp", alt: "A finished fade seen from behind at Barber Shack." },
  { src: "/images/shave-hot-towel.webp", alt: "A hot towel wrapped and steaming before a straight-razor shave, in black and white." },
  { src: "/images/shave-towel-hands.webp", alt: "Hands settling a hot towel over a client's face, in black and white." },
  { src: "/images/shave-lather-razor.webp", alt: "A straight razor working through the lather along a client's jaw, in black and white." },
  { src: "/images/shave-razor-jaw.webp", alt: "A steady hand drawing a straight razor down a lathered jawline, in black and white." },
  { src: "/images/shave-razor-highkey.webp", alt: "A straight razor taken over the scalp in high-key black and white." },
  { src: "/images/shave-neck-razor.webp", alt: "A close razor shave along the neckline, in black and white." },
  { src: "/images/shave-razor-lather.webp", alt: "A client reclined and lathered, razor in hand, in black and white." },
  { src: "/images/shave-reclined.webp", alt: "A client reclined in the chair mid-shave, in black and white." },
  { src: "/images/shave-filmstrip.webp", alt: "A shave in progress, framed like a strip of film, in black and white." },
  { src: "/images/shave-shop-bw.webp", alt: "A shave underway on the shop floor at Barber Shack, in black and white." },
  { src: "/images/client-portrait-bw.webp", alt: "A client caped up in the chair, beard freshly shaped, in black and white." },
];

const INSIDE: Shot[] = [
  { src: "/images/interior-shop-floor.webp", alt: "The Barber Shack shop floor with vintage barber chairs, station mirrors, and a coat rack built from engine pistons." },
  { src: "/images/interior-2.webp", alt: "Another look inside Barber Shack — chairs and stations along the shop floor." },
  { src: "/images/barber-pole.webp", ratio: "aspect-[11/13]", alt: "A classic red, white, and blue barber pole beside the Barber Shack BS logo wall." },
  { src: "/images/shop-sign.webp", alt: "The Barber Shack sign: seven days a week, family friendly prices, walk-ins welcome, 2500 Cedarwood Ave, Bellingham WA." },
  { src: "/images/tools-flatlay.webp", alt: "Barbering tools laid out on the towel — shears, clippers, and a straight razor." },
  { src: "/images/interior-chair.webp", alt: "A vintage barber chair standing ready on the shop floor." },
];

const TOONS: Shot[] = [
  { src: "/images/toon-tales.webp", ratio: "aspect-[4/5]", alt: "Illustrated Barber Shop Tales comic: the warm-up, prep work, precision cut, and the grand finale." },
  { src: "/images/toon-chair-tales.webp", ratio: "aspect-[3/4]", alt: "Illustrated Tales of the Chair comic: a curly cut being blow-dried, a beard trim, a kid waiting his turn, and a barber working the chair." },
  { src: "/images/toon-shop-panels.webp", ratio: "aspect-[3/4]", alt: "Illustrated comic panels around the shop — clipper work, a wash, a cut in progress, and the last touches." },
  { src: "/images/toon-art-of-the-cut.webp", ratio: "aspect-[3/4]", alt: "Illustrated The Art of the Cut comic: clippers on a fade, a barber finishing a client, and tattooed hands working scissors and comb." },
  { src: "/images/toon-before-after.webp", ratio: "aspect-[3/4]", alt: "Illustrated before-and-after comic: a client ready for a change, then the finished cut." },
  { src: "/images/toon-chair-client.webp", ratio: "aspect-[3/4]", alt: "Illustrated scene of a client being cut in the chair at Barber Shack." },
  { src: "/images/toon-fade-back.webp", ratio: "aspect-[3/4]", alt: "Illustrated back view of a finished fade in the shop." },
  { src: "/images/toon-lineup.webp", ratio: "aspect-[3/4]", alt: "Illustrated line-up in progress, razor working a clean edge." },
  { src: "/images/toon-kids-clippers.webp", ratio: "aspect-[3/4]", alt: "Illustrated kids' cut — clippers over a young client in the chair." },
  { src: "/images/toon-kids-chair2.webp", ratio: "aspect-[3/4]", alt: "Illustrated kids' cut in progress at the station." },
  { src: "/images/toon-mirror.webp", ratio: "aspect-[3/4]", alt: "Illustrated view through the station mirror as a cut is finished." },
  { src: "/images/toon-storefront.webp", ratio: "aspect-[4/3]", alt: "Illustrated Barber Shack storefront with the pride flag and BS sign." },
  { src: "/images/toon-interior.webp", ratio: "aspect-[4/3]", alt: "Illustrated interior of Barber Shack — chairs, mirrors, and the shop floor." },
  { src: "/images/logo-all-welcome.webp", ratio: "aspect-[4/5]", alt: "Barber Shack badge: Bellingham Barber Shack, everyone welcome, everyone respected, all welcome." },
  { src: "/images/toon-panels-a.webp", ratio: "aspect-[3/4]", alt: "Illustrated panels of the shop at work — cuts, colour, and conversation across four chairs." },
  { src: "/images/toon-panels-b.webp", ratio: "aspect-[3/4]", alt: "Illustrated panels of a busy day at Barber Shack, from the first cut to the finish." },
  { src: "/images/toon-buzz.webp", ratio: "aspect-[3/4]", alt: "Illustrated buzz cut in progress under the ring light." },
  { src: "/images/toon-chairs.webp", ratio: "aspect-[3/4]", alt: "Illustrated barber chairs and stations lined up along the shop floor." },
  { src: "/images/toon-interior2.webp", ratio: "aspect-[4/3]", alt: "Illustrated wide view inside Barber Shack — chairs, mirrors, and the wood floor." },
  { src: "/images/toon-street.webp", ratio: "aspect-[4/3]", alt: "Illustrated view of Barber Shack from the street." },
  { src: "/images/logo-bs-mark.webp", ratio: "aspect-[4/5]", alt: "The Barber Shack BS monogram mark." },
];

function ShotFigure({ s }: { s: Shot }) {
  return (
    <figure className="m-0">
      <div className={`relative ${s.ratio ?? "aspect-[3/4]"} w-full bg-paper border border-chrome/30`}>
        <Image src={s.src} alt={s.alt} fill sizes="(min-width: 640px) 33vw, 100vw" className="object-cover" />
      </div>
      <figcaption className="board text-xs text-meta mt-2">{s.alt}</figcaption>
    </figure>
  );
}

export default function GalleryPage() {
  const url = abs(ROUTES.gallery);
  const crumbs = [
    { name: "Home", item: abs(ROUTES.home) },
    { name: "Gallery", item: url },
  ];

  return (
    <>
      <JsonLd graph={pageGraph({ url, name: "Gallery — Barber Shack Bellingham", description: ANSWER, image: `${B.url}/images/cut-pompadour.webp`, crumbs })} />
      <Breadcrumbs crumbs={crumbs} />

      <h1 className="text-4xl md:text-5xl mt-2 mb-4">Gallery</h1>
      <p className="eyebrow mb-6">{BRAND.promise}</p>
      <AnswerBox>{ANSWER}</AnswerBox>

      <section className="my-10">
        <p className="eyebrow mb-3">At the chair</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CHAIR.map((s) => <ShotFigure key={s.src} s={s} />)}
        </div>
      </section>

      <section className="my-10">
        <p className="eyebrow mb-3">Inside the shop</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {INSIDE.map((s) => <ShotFigure key={s.src} s={s} />)}
        </div>
      </section>

      <section className="my-10">
        <p className="eyebrow mb-3">Shop art</p>
        <div className="grid gap-4 sm:grid-cols-3">
          {TOONS.map((s) => <ShotFigure key={s.src} s={s} />)}
        </div>
      </section>

      <CtaBar label={B.city} />
    </>
  );
}

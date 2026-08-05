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
    "Cuts, fades, and shaves from the chair, plus a look inside Barber Shack in Bellingham — the shop floor, the barber pole, and the team behind the $12 Tuesday.",
  alternates: { canonical: abs(ROUTES.gallery) },
};

const ANSWER =
  "Cuts, fades, and shaves from the chair at Barber Shack, plus a look inside the shop at 2500 " +
  "Cedarwood Ave in Bellingham — the floor, the barber pole, and the team behind the community " +
  "work and the $12 Tuesday.";

type Shot = { src: string; alt: string; ratio?: string };

const CHAIR: Shot[] = [
  { src: "/images/cut-pompadour.webp", alt: "A fresh side-part pompadour cut and styled at Barber Shack, in front of the BS logo wall." },
  { src: "/images/chair-fade.webp", alt: "A barber working a clean fade on a client at Barber Shack in Bellingham." },
  { src: "/images/cut-kids.webp", alt: "A young client smiling through a kids' cut at Barber Shack." },
  { src: "/images/chair-clipper.webp", alt: "A barber lining up a client's cut with clippers at Barber Shack." },
  { src: "/images/chair-scissor-bw.webp", alt: "Black-and-white photo of a barber scissor-cutting a client at Barber Shack." },
  { src: "/images/cut-fresh-fade.webp", alt: "A crisp, freshly finished fade at Barber Shack." },
  { src: "/images/shave-bw.webp", alt: "A traditional hot-towel straight-razor shave at Barber Shack, in black and white." },
  { src: "/images/cut-locs.webp", alt: "Healthy, maintained locs — textured hair care at Barber Shack." },
  { src: "/images/cut-braids.webp", alt: "Medium knotless braids styled at Barber Shack." },
  { src: "/images/cut-beard.webp", alt: "A full beard shaped and detailed at Barber Shack." },
  { src: "/images/cut-lineup.webp", alt: "A sharp line-up and fresh cut at Barber Shack." },
  { src: "/images/cut-hairart.webp", alt: "Custom hair-art design razored into a cut at Barber Shack." },
  { src: "/images/cut-fade2.webp", alt: "A sharp fade finished at Barber Shack." },
  { src: "/images/cut-clipper2.webp", alt: "A clean clipper cut in the chair at Barber Shack." },
  { src: "/images/cut-beard2.webp", alt: "A full beard trimmed and shaped at Barber Shack." },
  { src: "/images/cut-locs2.webp", alt: "Long, healthy locs cared for at Barber Shack." },
  { src: "/images/cut-kids-chair.webp", alt: "A young client getting a cut in the chair at Barber Shack." },
  { src: "/images/shave-razor-bw.webp", alt: "A straight-razor shave at Barber Shack, in black and white." },
  { src: "/images/barber-portrait.webp", alt: "A Barber Shack barber in front of the BS logo wall." },
];

const INSIDE: Shot[] = [
  { src: "/images/interior-shop-floor.webp", alt: "The Barber Shack shop floor with vintage barber chairs, station mirrors, and a coat rack built from engine pistons." },
  { src: "/images/interior-2.webp", alt: "Another look inside Barber Shack — chairs and stations along the shop floor." },
  { src: "/images/barber-pole.webp", ratio: "aspect-[11/13]", alt: "A classic red, white, and blue barber pole beside the Barber Shack BS logo wall." },
  { src: "/images/team.webp", ratio: "aspect-square", alt: "The Barber Shack team holding a banner that reads Empowering everyone to shine, Home of the $12 Tuesday." },
  { src: "/images/shop-sign.webp", alt: "The Barber Shack sign: seven days a week, family friendly prices, walk-ins welcome, 2500 Cedarwood Ave, Bellingham WA." },
];

const TOONS: Shot[] = [
  { src: "/images/toon-tales.webp", ratio: "aspect-[4/5]", alt: "Illustrated Barber Shop Tales comic: the warm-up, prep work, precision cut, and the grand finale." },
  { src: "/images/toon-storefront.webp", ratio: "aspect-[4/3]", alt: "Illustrated Barber Shack storefront with the pride flag and BS sign." },
  { src: "/images/toon-interior.webp", ratio: "aspect-[4/3]", alt: "Illustrated interior of Barber Shack — chairs, mirrors, and the shop floor." },
];

function ShotFigure({ s }: { s: Shot }) {
  return (
    <figure className="m-0">
      <div className={`relative ${s.ratio ?? "aspect-[3/4]"} w-full bg-paper border border-chrome/30`}>
        <Image src={s.src} alt={s.alt} fill sizes="(min-width: 640px) 33vw, 100vw" className="object-cover" />
      </div>
      <figcaption className="board text-xs text-chrome mt-2">{s.alt}</figcaption>
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

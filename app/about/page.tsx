/**
 * ABOUT — the shop story plus Jared's first-person owner bio (the site's strongest
 * E-E-A-T signal: a named, credentialed founder). His bio is verbatim and is never
 * rewritten into marketing voice.
 */
import type { Metadata } from "next";
import Image from "next/image";
import { BUSINESS as B, NAP } from "@/content/business";
import { OWNER } from "@/content/owner";
import { ROUTES, abs, BRAND } from "@/lib/routes";
import { pageGraph, ownerNode } from "@/lib/schema";
import JsonLd from "@/components/JsonLd";
import Breadcrumbs from "@/components/Breadcrumbs";
import AnswerBox from "@/components/AnswerBox";
import TrustStrip from "@/components/TrustStrip";
import CtaBar from "@/components/CtaBar";
import Photo from "@/components/Photo";

export const metadata: Metadata = {
  title: `About Barber Shack — ${NAP.cityState}`,
  description:
    "Barber Shack is a community barbershop on Cedarwood Ave in Bellingham, owned by master barber and Washington State instructor Jared Jones-Valentine. Seven days a week, $12 Tuesdays, everyone welcome.",
  alternates: { canonical: abs(ROUTES.about) },
};

const ANSWER =
  "Barber Shack is a community barbershop on Cedarwood Ave in Bellingham, owned by master barber " +
  "Jared Jones-Valentine. It is a community hub first and a barbershop second — open seven days a " +
  "week, walk-ins welcome, and $12 standard haircuts for everyone on Tuesdays.";

export default function AboutPage() {
  const url = abs(ROUTES.about);
  const crumbs = [
    { name: "Home", item: abs(ROUTES.home) },
    { name: "About", item: url },
  ];

  const graph = pageGraph({ url, name: `About Barber Shack — ${NAP.cityState}`, description: ANSWER, crumbs });
  (graph["@graph"] as Record<string, unknown>[]).push(ownerNode());

  return (
    <>
      <JsonLd graph={graph} />
      <Breadcrumbs crumbs={crumbs} />

      <h1 className="text-4xl md:text-5xl mt-2 mb-4">About Barber Shack</h1>
      <p className="eyebrow mb-4">{BRAND.tagline} · {BRAND.homeOfTuesday}</p>
      <TrustStrip />
      <AnswerBox>{ANSWER}</AnswerBox>

      <Photo
        className="my-10 max-w-2xl"
        ratio="aspect-[16/10]"
        src="/images/interior-shop-floor.webp"
        alt="Inside Barber Shack: the shop floor with vintage barber chairs and station mirrors at 2500 Cedarwood Ave."
        caption="Inside the shop on Cedarwood Avenue."
      />

      <section className="my-10 max-w-2xl">
        <p className="mb-4">
          From the start, Barber Shack has been built around one idea: a barbershop should be a
          community hub first and a place that cuts hair second. That is not a marketing layer on top
          of the business — it is the reason the business exists. The shop puts it in three words on
          its own banner: <em>empowering everyone to shine</em>.
        </p>
        <p className="mb-4">
          In practice that means the door is open seven days a week, including Sunday, and walk-ins
          are always welcome. It means that every Tuesday, our standard haircuts are $12 for everyone, all day,
          with no qualifying and no separate line — an access program for single parents, people on
          Social Security or state assistance, and anyone getting ready to go back to work. A sharp
          haircut changes how you walk into a room, and money should not stand between anyone and
          that.
        </p>
        <p className="mb-4">
          The shop is also more than one trade. Under the same roof you will find the barbering
          chairs the shop runs itself, alongside a group of independent studios — a full salon,
          textured hair, braids and locs, a toupee studio, and a tattoo studio — each run by its own
          licensed professional. The shop also trains the next generation of barbers through an
          apprentice program, which is part of why it treats the craft as seriously as it does.
        </p>
        <p className="mb-4">
          Out in the neighborhood, that same thinking shows up as a standing booth at the local
          Autism Walk, back-to-school haircuts, haircut vouchers through local shelters and
          agencies, a Community Art Wall given over to local artists, and the Rainbow Bridge on
          Northwest Avenue — a permanent landmark the shop was the driving force behind.
        </p>
      </section>

      {/* MEET JARED — first-person owner bio. E-E-A-T: named, credentialed founder. */}
      <section className="my-14 border-t-2 border-ink pt-8">
        <p className="eyebrow mb-2">Meet the owner</p>
        <h2 className="text-3xl mb-6">{OWNER.headline}</h2>
        <div className="grid gap-8 md:grid-cols-[minmax(0,18rem)_1fr] items-start">
          <figure className="m-0">
            <div className="relative aspect-[4/5] w-full bg-paper border border-chrome/30 overflow-hidden rounded-lg">
              <Image
                src={OWNER.photo}
                alt={`${OWNER.name}, ${OWNER.role} at Barber Shack in Bellingham.`}
                fill
                sizes="(min-width: 768px) 18rem, 100vw"
                className="object-cover"
              />
            </div>
            <figcaption className="board text-xs text-meta mt-2">
              {OWNER.name} · {OWNER.role}
            </figcaption>
          </figure>
          <div className="max-w-xl">
            {OWNER.bio.map((para, i) => (
              <p key={i} className="mb-4">{para}</p>
            ))}
            <p className="eyebrow mt-6 mb-2">Credentials</p>
            <ul className="board text-sm space-y-1 text-ink/85">
              {OWNER.credentials.map((c) => (
                <li key={c} className="border-b border-chrome/30 pb-1">{c}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <Photo
        className="my-10 max-w-2xl"
        ratio="aspect-[6/5]"
        src="/images/interior-shop-floor.webp"
        alt="The Barber Shack shop floor in Bellingham — vintage barber chairs, station mirrors, and a coat rack built from engine pistons."
        caption="The room where it happens, on Cedarwood Ave."
      />

      <CtaBar label={B.city} />
    </>
  );
}

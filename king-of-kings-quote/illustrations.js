/**
 * Inline SVG art for the illustrated card steps.
 *
 * The reference tool uses stock photography for roof material and moss
 * coverage. These are vector equivalents: no image assets to license, host,
 * or wait on, they stay crisp at any density, and they render identically
 * offline. Each returns a string sized to a 5:4 box.
 */

const ART = (() => {
  // Every <svg> shares one document, so defs ids must be unique per instance.
  let uid = 0;
  const nextId = (p) => p + "-" + ++uid;

  const box = (inner, bg) =>
    `<svg viewBox="0 0 200 160" role="img" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
       <rect width="200" height="160" fill="${bg}"/>${inner}
     </svg>`;

  /* --- roof materials ---------------------------------------------------- */

  // Overlapping 3-tab shingle courses, with granule speckle.
  const asphalt = () => {
    let s = "";
    for (let row = 0; row < 7; row++) {
      const y = row * 24 - 8;
      const offset = row % 2 ? -26 : 0;
      for (let col = 0; col < 5; col++) {
        const x = col * 52 + offset;
        s += `<rect x="${x}" y="${y}" width="50" height="22" rx="2" fill="#3c4249"/>
              <rect x="${x}" y="${y}" width="50" height="3" fill="#4a5057"/>
              <rect x="${x + 16}" y="${y + 6}" width="2" height="16" fill="#2c3137"/>
              <rect x="${x + 33}" y="${y + 6}" width="2" height="16" fill="#2c3137"/>`;
      }
    }
    let speck = "";
    for (let i = 0; i < 90; i++) {
      const x = (i * 37) % 200, y = (i * 71) % 160;
      speck += `<circle cx="${x}" cy="${y}" r="0.9" fill="#7d858e" opacity="0.35"/>`;
    }
    return box(s + speck, "#2c3137");
  };

  // Barrel tile: alternating rounded ridges with shadowed valleys.
  const tile = () => {
    let s = "";
    for (let row = 0; row < 6; row++) {
      const y = row * 28 - 6;
      const offset = row % 2 ? -20 : 0;
      for (let col = 0; col < 6; col++) {
        const x = col * 40 + offset;
        s += `<path d="M${x} ${y + 26} L${x} ${y + 10} Q${x + 18} ${y - 6} ${x + 36} ${y + 10} L${x + 36} ${y + 26} Z" fill="#b9b2a6"/>
              <path d="M${x} ${y + 26} L${x} ${y + 10} Q${x + 9} ${y + 1} ${x + 18} ${y + 2} L${x + 18} ${y + 26} Z" fill="#cbc5ba"/>
              <rect x="${x + 36}" y="${y + 8}" width="4" height="18" fill="#5d5a54"/>`;
      }
    }
    return box(s, "#4c4a45");
  };

  // Hand-split cedar shakes: warm, irregular widths, visible grain.
  const cedar = () => {
    let s = "";
    const widths = [26, 34, 22, 30, 38, 24, 32, 28];
    for (let row = 0; row < 6; row++) {
      const y = row * 27 - 6;
      let x = row % 2 ? -14 : 0;
      let i = row;
      while (x < 200) {
        const w = widths[i % widths.length];
        const fill = ["#ab8560", "#a07c55", "#b08a60", "#96724c", "#ba9670"][i % 5];
        s += `<rect x="${x}" y="${y}" width="${w - 2}" height="25" rx="1" fill="${fill}"/>
              <rect x="${x}" y="${y}" width="${w - 2}" height="2.5" fill="#7d5f3f" opacity="0.5"/>
              <rect x="${x + 5}" y="${y + 6}" width="1" height="17" fill="#7d5f3f" opacity="0.45"/>
              <rect x="${x + Math.round(w / 2)}" y="${y + 4}" width="1" height="19" fill="#7d5f3f" opacity="0.35"/>`;
        x += w;
        i++;
      }
    }
    return box(s, "#6b4f34");
  };

  // Standing-seam metal: vertical panels with raised seams and a light sweep.
  const metal = () => {
    let s = "";
    for (let col = 0; col < 8; col++) {
      const x = col * 26;
      s += `<rect x="${x}" y="0" width="24" height="160" fill="#5a6068"/>
            <rect x="${x + 22}" y="0" width="4" height="160" fill="#7b828b"/>
            <rect x="${x + 21}" y="0" width="1.5" height="160" fill="#3f444a"/>`;
    }
    const sheen = nextId("sheen");
    s += `<rect width="200" height="160" fill="url(#${sheen})"/>
          <defs><linearGradient id="${sheen}" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.14"/>
            <stop offset="45%" stop-color="#ffffff" stop-opacity="0"/>
            <stop offset="100%" stop-color="#000000" stop-opacity="0.18"/>
          </linearGradient></defs>`;
    return box(s, "#4b5157");
  };

  /* --- moss coverage ------------------------------------------------------ */

  // One house silhouette, four moss densities. Deterministic blotch placement
  // so a given level always renders identically.
  const house = (blotches) => {
    const ROOF = "M100 22 L182 96 L18 96 Z";
    const DORMER = "M62 62 L92 88 L32 88 Z";
    const clip = nextId("roof");
    const roofL = `<path d="${ROOF}" fill="#41474e"/>`;
    const shade = `<path d="M100 22 L182 96 L100 96 Z" fill="#363c42"/>`;
    const dormer = `<path d="${DORMER}" fill="#4a5057"/>`;
    // Moss grows ON the roof. Unclipped blobs float past the ridge and eaves.
    const clipped = blotches
      ? `<defs><clipPath id="${clip}"><path d="${ROOF}"/><path d="${DORMER}"/></clipPath></defs>
         <g clip-path="url(#${clip})">${blotches}</g>`
      : "";
    const body = `<rect x="26" y="96" width="148" height="44" fill="#e8ebee"/>
                  <rect x="44" y="106" width="22" height="26" fill="#9fb4c6"/>
                  <rect x="90" y="106" width="22" height="26" fill="#9fb4c6"/>
                  <rect x="136" y="106" width="22" height="26" fill="#9fb4c6"/>
                  <rect x="26" y="94" width="148" height="4" fill="#ffffff"/>`;
    const chimney = `<rect x="132" y="40" width="14" height="26" fill="#8a6f61"/>`;
    return box(
      `<rect width="200" height="160" fill="#93b4cf"/>
       <ellipse cx="40" cy="150" rx="60" ry="22" fill="#6f9a6a"/>
       <ellipse cx="170" cy="152" rx="50" ry="20" fill="#628c5e"/>
       ${chimney}${roofL}${shade}${dormer}${clipped}${body}`,
      "#93b4cf"
    );
  };

  // Moss patches expressed as layered translucent blobs over the roof planes.
  const moss = (seeds, opacity, r) =>
    seeds
      .map(
        ([x, y, s]) =>
          `<ellipse cx="${x}" cy="${y}" rx="${r * s}" ry="${r * s * 0.62}" fill="#6f9b3f" opacity="${opacity}"/>
           <ellipse cx="${x + 3}" cy="${y - 2}" rx="${r * s * 0.55}" ry="${r * s * 0.36}" fill="#8fbc55" opacity="${opacity * 0.85}"/>`
      )
      .join("");

  const HEAVY = [[70,58,1.5],[96,44,1.2],[120,62,1.6],[52,76,1.3],[86,74,1.5],[132,80,1.4],[108,88,1.3],[62,90,1.2],[148,90,1.1],[100,64,1.4],[40,88,1.0],[160,84,0.9]];
  const MEDIUM = [[74,60,1.1],[112,70,1.2],[58,82,0.9],[132,84,1.0],[96,88,0.8]];
  const LIGHT  = [[86,80,0.7],[124,86,0.6],[60,90,0.5]];

  return {
    asphalt,
    tile,
    cedar,
    metal,
    mossHeavy:  () => house(moss(HEAVY, 0.9, 13)),
    mossMedium: () => house(moss(MEDIUM, 0.75, 12)),
    mossLight:  () => house(moss(LIGHT, 0.55, 10)),
    mossNone:   () => house(""),
  };
})();

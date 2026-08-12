import type { Config } from 'tailwindcss'

/**
 * DESIGN TOKENS — derived from the trade's own material world, not a template.
 *
 * Palette: patinated copper and galvanized steel. The river green reads as
 * Hiwassee/Ocoee water. Signal amber is reserved EXCLUSIVELY for emergency
 * and after-hours CTAs — using it anywhere else destroys its meaning.
 *
 * Type: Archivo carries a utilitarian, stamped quality for display. Source Sans 3
 * is the workhorse. IBM Plex Mono is doing real work, not decoration: license
 * numbers, permit authority, and scope data render as spec-sheet facts. That
 * mono treatment is the site's signature and the thing no competitor has.
 */
export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './content/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#14201C',        // near-black with a green cast — river depth
        verdigris: '#2E7268',  // patinated copper — primary
        copper: '#B4633A',     // raw copper — accent, links, rules
        galv: '#E4E7E5',       // galvanized sheet — section backgrounds
        paper: '#F7F8F7',      // page background
        steel: '#5A6663',      // secondary text
        signal: '#E8A317',     // EMERGENCY CTA ONLY. Never decorative.
      },
      fontFamily: {
        display: ['var(--font-archivo)', 'system-ui', 'sans-serif'],
        body: ['var(--font-source)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-plex-mono)', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        'display-xl': ['clamp(2.5rem,6vw,4.5rem)', { lineHeight: '0.95', letterSpacing: '-0.03em', fontWeight: '700' }],
        'display-lg': ['clamp(2rem,4.5vw,3rem)', { lineHeight: '1.0', letterSpacing: '-0.02em', fontWeight: '700' }],
        'spec': ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.06em' }],
      },
      borderRadius: { none: '0', sm: '2px', DEFAULT: '3px' },
    },
  },
  plugins: [],
} satisfies Config

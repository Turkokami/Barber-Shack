import type { Metadata } from 'next'
import { Archivo, Source_Sans_3, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'

const archivo = Archivo({ subsets: ['latin'], variable: '--font-archivo', display: 'swap' })
const source = Source_Sans_3({ subsets: ['latin'], variable: '--font-source', display: 'swap' })
const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-plex-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: { default: 'Licensed Plumber — Bradley & McMinn County, TN', template: '%s' },
  description:
    'Licensed Tennessee plumber serving Charleston, Cleveland, Athens, and the US-11 corridor. TN license #5045.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${source.variable} ${plexMono.variable}`}>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:block focus:p-3">
          Skip to content
        </a>
        <main id="main">{children}</main>
      </body>
    </html>
  )
}

import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Ember — For Redheads & Those Who Love Them',
  description: 'A premium dating app for redheads and admirers.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full antialiased">
        {/* 430px phone-width container — bg-surface body frames it on desktop */}
        <div className="relative mx-auto w-full max-w-[430px] min-h-dvh bg-[#0D0A08] overflow-x-hidden">
          {children}
        </div>
      </body>
    </html>
  )
}

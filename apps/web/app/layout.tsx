import type { Metadata } from 'next'
import ToastProvider from '@/components/providers/ToastProvider'
import './globals.css'

export const metadata: Metadata = {
  title: 'PrepReach | Regional Government Exam Bootcamps',
  description:
    'PrepReach is a pay-per-course government exam preparation platform designed for ambitious aspirants in Tier 2 and Tier 3 cities. Specialized tracks for Civil Service, Banking, Railway, and Municipal examinations.',
  keywords: ['government exam', 'UPSC', 'IBPS', 'railway exam', 'RRB NTPC', 'State PSC', 'PrepReach'],
  openGraph: {
    title: 'PrepReach | Government Exam Bootcamps',
    description: 'Targeted, pay-per-course preparation for competitive government examinations.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans bg-white text-slate-900 antialiased selection:bg-slate-200">
        {children}
        <ToastProvider />
      </body>
    </html>
  )
}

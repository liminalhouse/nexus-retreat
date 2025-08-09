import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
})

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
})

export const metadata: Metadata = {
    title: 'Nexus Retreat',
    description: 'Bruin Capital and Sportico',
    generator: 'Next.js',
    manifest: '/manifest.json',
    keywords: ['nextjs', 'next14', 'pwa', 'next-pwa'],
    themeColor: [{ media: '(prefers-color-scheme: dark)', color: '#fff' }],
    viewport:
        'minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover',
    icons: [
        { rel: 'apple-touch-icon', url: 'icons/favicon.svg' },
        { rel: 'icon', url: 'icons/favicon.svg' },
    ],
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable}`}>
                {children}
            </body>
        </html>
    )
}

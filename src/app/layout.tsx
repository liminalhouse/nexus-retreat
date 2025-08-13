import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.scss'
import theme from '../theme'
import { ThemeProvider } from '@mui/material'

const body = Geist({
    variable: '--font-body',
    subsets: ['latin'],
})

export const metadata: Metadata = {
    title: 'Nexus Retreat',
    description: 'Bruin Capital and Sportico',
    generator: 'Next.js',
    manifest: '/manifest.json',
    keywords: ['nextjs', 'next14', 'pwa', 'next-pwa'],
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
            <body className={`${body.variable}`}>
                <ThemeProvider theme={theme}>
                    <main>{children}</main>
                </ThemeProvider>
            </body>
        </html>
    )
}

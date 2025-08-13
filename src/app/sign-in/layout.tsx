import '@/globals.scss'

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return <main className="bodyWhite">{children}</main>
}

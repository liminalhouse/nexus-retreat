import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import SessionNotifier from '@/app/components/SessionNotifier'

export default function MainLayout({children}: {children: React.ReactNode}) {
  return (
    <>
      <Header />
      <SessionNotifier />
      <main className="flex-1 pt-[70px]">{children}</main>
      <Footer />
    </>
  )
}

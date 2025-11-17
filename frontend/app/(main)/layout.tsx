import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'

export default function MainLayout({children}: {children: React.ReactNode}) {
  return (
    <>
      <Header />
      <main className="flex-1 pt-[70px]">{children}</main>
      <Footer />
    </>
  )
}

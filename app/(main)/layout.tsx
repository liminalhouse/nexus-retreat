import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import PushNotificationToggle from '@/app/components/PushNotificationToggle'

export default function MainLayout({children}: {children: React.ReactNode}) {
  return (
    <>
      <Header />
      <PushNotificationToggle />
      <main className="flex-1 pt-[70px]">{children}</main>
      <Footer />
    </>
  )
}

import Header from '@/app/components/Header'
import ToastWrapper from './ToastWrapper'

export default function EditRegistrationLayout({children}: {children: React.ReactNode}) {
  return (
    <ToastWrapper>
      <Header />
      <main className="pt-18">{children}</main>
    </ToastWrapper>
  )
}

'use client'

import {ToastProvider} from '@/app/components/Toast/ToastContext'
import ToastContainer from '@/app/components/Toast/Toast'

export default function EditRegistrationLayout({children}: {children: React.ReactNode}) {
  return (
    <ToastProvider>
      {children}
      <ToastContainer />
    </ToastProvider>
  )
}

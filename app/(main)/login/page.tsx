'use client'

import {Suspense} from 'react'
import {useSearchParams} from 'next/navigation'
import LoginForm from '@/app/components/LoginForm'

function LoginWithParams() {
  const searchParams = useSearchParams()
  const from = searchParams.get('from') || '/chat'
  return <LoginForm from={from} />
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginWithParams />
    </Suspense>
  )
}

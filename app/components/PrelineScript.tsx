'use client'

import {useEffect} from 'react'
import {usePathname} from 'next/navigation'

export default function PrelineScript() {
  const pathname = usePathname()

  useEffect(() => {
    const loadPreline = async () => {
      try {
        await import('preline/preline')

        // Check if HSStaticMethods is available
        if (typeof window !== 'undefined') {
          setTimeout(() => {
            if ((window as any).HSStaticMethods) {
              ;(window as any).HSStaticMethods.autoInit()
            }
          }, 100)
        }
      } catch (error) {
        console.error('Failed to load Preline:', error)
      }
    }

    loadPreline()
  }, [pathname])

  return null
}

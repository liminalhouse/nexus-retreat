'use client'

import {useEffect} from 'react'

export default function PrelineScript() {
  useEffect(() => {
    const loadPreline = async () => {
      try {
        await import('preline/preline')
        console.log('Preline loaded successfully')

        // Check if HSStaticMethods is available
        if (typeof window !== 'undefined') {
          setTimeout(() => {
            console.log('Window.HSStaticMethods:', (window as any).HSStaticMethods)
            if ((window as any).HSStaticMethods) {
              (window as any).HSStaticMethods.autoInit()
              console.log('Preline initialized')
            }
          }, 100)
        }
      } catch (error) {
        console.error('Failed to load Preline:', error)
      }
    }

    loadPreline()
  }, [])

  return null
}

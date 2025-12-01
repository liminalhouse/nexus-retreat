'use client'

import {useEffect, useState} from 'react'
import {browserClient} from '@/sanity/lib/client.browser'
import {settingsQuery} from '@/sanity/lib/queries'
import {SettingsQueryResult} from '@/sanity.types'

/**
 * Hook to fetch and use settings from Sanity CMS in client components
 * Requires dataset to be set to public read access in Sanity project settings
 * @returns Settings object or null if not yet loaded
 */
export function useSettings() {
  const [settings, setSettings] = useState<SettingsQueryResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true)
        const data = await browserClient.fetch(settingsQuery)
        setSettings(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch settings'))
      } finally {
        setIsLoading(false)
      }
    }

    fetchSettings()

    // Subscribe to real-time changes in settings document
    const subscription = browserClient
      .listen(settingsQuery, {}, {includeResult: true})
      .subscribe((update) => {
        if (update.result) {
          setSettings(update.result)
        }
      })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return {settings, isLoading, error}
}

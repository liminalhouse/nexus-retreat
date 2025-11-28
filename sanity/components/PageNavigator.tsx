'use client'

import {useEffect, useState} from 'react'
import {Card, Flex, Text, Stack, Box, Spinner} from '@sanity/ui'
import {DocumentIcon} from '@sanity/icons'
import {useClient} from 'sanity'
import {type SanityDocument} from 'sanity'

interface Page extends SanityDocument {
  _id: string
  _type: 'page'
  name: string
  slug?: {
    current: string
  }
}

export function PageNavigator() {
  const client = useClient({apiVersion: '2025-09-25'})
  const [pages, setPages] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch all pages
    client
      .fetch<Page[]>(`*[_type == "page"] | order(name asc) {_id, name, slug}`)
      .then((fetchedPages) => {
        setPages(fetchedPages)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Failed to fetch pages:', error)
        setLoading(false)
      })
  }, [client])

  const handlePageClick = (page: Page) => {
    const path = page.slug?.current ? `/${page.slug.current}` : '/'

    // Try multiple selectors to find the preview iframe
    let iframe = document.querySelector('iframe[data-sanity-preview-frame]') as HTMLIFrameElement

    if (!iframe) {
      iframe = document.querySelector('iframe[name="preview"]') as HTMLIFrameElement
    }

    if (!iframe) {
      iframe = document.querySelector('iframe') as HTMLIFrameElement
    }

    if (!iframe) {
      return
    }

    try {
      // Get the current iframe origin
      const iframeOrigin = new URL(iframe.src).origin

      // Construct the new preview URL
      const newPreviewUrl = `${iframeOrigin}${path}`

      // Navigate the iframe without refreshing the parent
      iframe.src = newPreviewUrl
    } catch (error) {
      console.error('Error navigating iframe:', error)
    }
  }

  if (loading) {
    return (
      <Box padding={4}>
        <Flex justify="center" align="center">
          <Spinner />
        </Flex>
      </Box>
    )
  }

  return (
    <Stack space={2} padding={3}>
      <Box paddingX={2} paddingY={3}>
        <Text size={1} weight="semibold" muted>
          PAGES
        </Text>
      </Box>
      {pages.map((page) => {
        const pagePath = page.slug?.current ? `/${page.slug.current}` : '/'

        return (
          <Card
            key={page._id}
            padding={3}
            radius={2}
            style={{cursor: 'pointer'}}
            onClick={() => handlePageClick(page)}
            tone="default"
            as="button"
          >
            <Flex align="center" gap={3}>
              <Text size={2}>
                <DocumentIcon />
              </Text>
              <Stack space={1} flex={1}>
                <Text size={1}>
                  {page.name}
                </Text>
                <Text size={0} muted>
                  {pagePath}
                </Text>
              </Stack>
            </Flex>
          </Card>
        )
      })}
    </Stack>
  )
}

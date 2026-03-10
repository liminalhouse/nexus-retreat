self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()))

self.addEventListener('push', (event) => {
  if (!event.data) return
  const {title, body, tag, url} = event.data.json()
  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      tag, // deduplicates: same tag replaces prior notification for same session
      data: {url},
    })
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const path = event.notification.data?.url || '/schedule'
  const targetUrl = new URL(path, self.location.origin).href
  event.waitUntil(
    clients.matchAll({type: 'window', includeUncontrolled: true}).then((list) => {
      for (const client of list) {
        if (client.url === targetUrl && 'focus' in client) return client.focus()
      }
      return clients.openWindow(targetUrl)
    })
  )
})

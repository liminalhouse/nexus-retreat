self.addEventListener('push', (event) => {
  if (!event.data) return
  const {title, body, tag, url} = event.data.json()
  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: '/images/icon-192.png',
      tag, // deduplicates: same tag replaces prior notification for same session
      data: {url},
    })
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = event.notification.data?.url || '/schedule'
  event.waitUntil(
    clients.matchAll({type: 'window', includeUncontrolled: true}).then((list) => {
      for (const client of list) {
        if (client.url.includes(url) && 'focus' in client) return client.focus()
      }
      return clients.openWindow(url)
    })
  )
})

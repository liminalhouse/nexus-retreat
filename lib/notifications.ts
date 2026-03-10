export type StoredNotification = {
  id: string
  title: string
  body: string | null
  timestamp: number
  url?: string
}

const HISTORY_KEY = 'nexusNotificationHistory'
const UNREAD_KEY = 'nexusUnreadCount'
const MAX_HISTORY = 30

export function pushNotification(notif: StoredNotification): void {
  try {
    const history = getNotificationHistory()
    const next = [notif, ...history].slice(0, MAX_HISTORY)
    localStorage.setItem(HISTORY_KEY, JSON.stringify(next))
    localStorage.setItem(UNREAD_KEY, String(getUnreadCount() + 1))
  } catch {}
  window.dispatchEvent(new CustomEvent('nexus:notification', {detail: notif}))
}

export function getNotificationHistory(): StoredNotification[] {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]')
  } catch {
    return []
  }
}

export function getUnreadCount(): number {
  return parseInt(localStorage.getItem(UNREAD_KEY) || '0', 10)
}

export function clearUnreadCount(): void {
  localStorage.setItem(UNREAD_KEY, '0')
}

export type ChatUser = {
  id: string
  registrationId: string
  firstName: string
  lastName: string
  email: string
  title: string | null
  organization: string | null
  profilePicture: string | null
}

export type ChatMessageData = {
  id: string
  senderId: string
  receiverId: string
  content: string
  readAt: string | null
  createdAt: string
}

export type Conversation = {
  partnerId: string
  partnerName: string
  partnerTitle: string | null
  partnerOrganization: string | null
  partnerPhoto: string | null
  partnerOnline: boolean
  lastMessage: string
  lastMessageAt: string
  lastMessageSenderId: string
  unreadCount: number
}

export type Attendee = {
  id: string
  firstName: string
  lastName: string
  title: string | null
  organization: string | null
  profilePicture: string | null
  online: boolean
}

export interface ChatCardData {
  id: number;
  chatName: string;
  lastMessage: string;
  unreadCount: number;
  messages: { text: string; fromMe: boolean }[];
}
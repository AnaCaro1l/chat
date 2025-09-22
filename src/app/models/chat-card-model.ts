import { Message } from "../services/messages.service";

export interface ChatCardData {
  id: number;
  chatName: string;
  lastMessage: string;
  messages: Message[];
}
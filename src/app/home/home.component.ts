import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import {
  LucideAngularModule,
  MessageCircle,
  LogOut,
  UserPen,
  MessageCirclePlus,
  MessageCircleX,
  Menu
} from 'lucide-angular';
import { ChatCardComponent } from '../components/chat-card/chat-card.component';
import { MessageComponent } from '../components/message/message.component';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { MessageInputComponent } from '../components/message-input/message-input.component';
import { MatIconButton } from '@angular/material/button';
import { SkeletonModule } from 'primeng/skeleton';
import { MatDialog } from '@angular/material/dialog';
import { RegisterComponent } from '../auth/register/register.component';
import { NewChatComponent } from './new-chat/new-chat.component';
import { UserService } from '../services/user.service';
import { Chat, ChatsService } from '../services/chats.service';
import { forkJoin, from, map, switchMap } from 'rxjs';
import { ChatCardData } from '../models/chat-card-model';
import { Message, MessagesService } from '../services/messages.service';

@Component({
  selector: 'app-home',
  imports: [
    Toast,
    LucideAngularModule,
    ChatCardComponent,
    MessageComponent,
    NgFor,
    CommonModule,
    MessageInputComponent,
    MatIconButton,
    SkeletonModule,
    NgIf,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone: true,
  providers: [MessageService, UserService, ChatsService],
})
export class HomeComponent implements OnInit {
  readonly messageCircleX = MessageCircleX;
  readonly logOut = LogOut;
  readonly userPen = UserPen;
  readonly messagePlus = MessageCirclePlus;
  readonly menu = Menu;

  chatOpen = false;
  menuOpen = true;

  chats: ChatCardData[] = [];
  loadingChats = true;

  selectedChat: ChatCardData | null = null;

  constructor(
    private messageService: MessageService,
    private router: Router,
    private dialog: MatDialog,
    private userService: UserService,
    private chatsService: ChatsService,
    private messagesService: MessagesService,

  ) {}

  ngOnInit(): void {
    this.loadChats();

    this.messagesService.onMessage().subscribe((msg: Message) => {
      if (this.selectedChat && msg.chatId === this.selectedChat.id) {
        this.messages.push(msg);
      }
    });

  }

  messages: Message[] = [];

  loadChats() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

    if (!currentUser.user?.id) {
      console.error('Usuário não possui id');
      return;
    }

    this.chatsService
      .getChats(currentUser.user.id)
      .pipe(
        switchMap((response: any) => {
          const chatsArray = response.chats;

          const chatsWithNames$ = chatsArray.map((chat: Chat) => {
            return this.userService.showUser(chat.recipientId).pipe(
              map((user: any) => {
                return {
                  id: chat.id,
                  chatName: user?.user.name || 'Desconhecido',
                  lastMessage: chat.lastMessage || 'Nenhuma mensagem ainda',
                  unreadCount:
                    chat.messages?.filter((msg: any) => !msg.read).length || 0,
                  messages: chat.messages || [],
                } as ChatCardData;
              })
            );
          });

          return forkJoin<ChatCardData[]>(chatsWithNames$);
        })
      )
      .subscribe(
        (chats: ChatCardData[]) => {
          this.chats = chats;
          this.loadingChats = false;
        },
        (err) => {
          console.error('Erro ao carregar chats', err);
          this.loadingChats = false;
        }
      );
  }

  logout() {
    localStorage.setItem('auth', 'false');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Deslogado com sucesso',
    });
  }

  openChat(chat: ChatCardData) {
    this.router.navigate(['home/chat', chat.id])
    this.chatOpen = true;
    this.messages = [];

    this.messagesService.joinChat(chat.id)
    
    this.messagesService.listMessages(chat.id).subscribe({
      next: (res: any) => {
        this.messages = res.messages.sort(
          (a: Message, b: Message) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      },
      error: (err) => console.error('Erro ao carregar mensagens do chat', err),
    });
  }

  openProfile() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

    if (!currentUser.user?.id) {
      console.error('Usuário não possui id');
      return;
    }

    this.userService.showUser(currentUser.user.id).subscribe({
      next: (user) => {
        this.dialog.open(RegisterComponent, {
          height: '90vh',
          data: { user },
        });
      },
      error: (err) => {
        console.error('Erro ao buscar usuário:', err);
      },
    });
  }

  openNewChat() {
    this.dialog.open(NewChatComponent, {
      height: '40vh',
      width: '20vw',
    });
  }

  sendMessage(body: string) {
    if (!this.selectedChat) return;

    this.messagesService.createMessage(body, this.selectedChat.id).subscribe();
  }

  trackById(index: number, msg: Message) {
    return msg.createdAt;
  }

  updateMessage(event: { id: number; body: string }) {
    const index = this.messages.findIndex((m) => m.id === event.id);
    if (index > -1) {
      this.messages[index] = { ...this.messages[index], body: event.body };
    }
  }

  deleteMessage(id: number) {
    this.messages = this.messages.filter((m) => m.id !== id);
  }
}

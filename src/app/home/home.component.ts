import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  HostListener,
} from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import {
  LucideAngularModule,
  LogOut,
  UserPen,
  MessageCirclePlus,
  MessageCircleX,
  Menu,
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
import { forkJoin, map, switchMap } from 'rxjs';
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

  @ViewChild('messagesConteiner') private messagesContainer!: ElementRef;

  private shouldScroll = false;
  isMobile = false;

  constructor(
    private messageService: MessageService,
    private router: Router,
    private dialog: MatDialog,
    private userService: UserService,
    private chatsService: ChatsService,
    private messagesService: MessagesService
  ) {}

  ngOnInit(): void {
    this.loadChats();

    this.checkScreenSize();

    this.messagesService.onMessage().subscribe((msg) => {
      const chat = this.chats.find((c) => c.id === msg.chatId);
      if (chat) chat.lastMessage = msg.body;

      if (this.selectedChat?.id === msg.chatId) {
        this.messages.push(msg);
        this.shouldScroll = true;
      }
    });

    this.messagesService.onLastMessage().subscribe(({ chatId, body }) => {
      const chat = this.chats.find((c) => c.id === chatId);
      if (chat) chat.lastMessage = body;
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    if (window.innerWidth < 760) {
      this.menuOpen = false;
      this.isMobile = true; // no mobile, só mostra chats
    } else {
      this.menuOpen = true;
      this.isMobile = false; // no desktop, sempre mostra os dois
    }
  }

  messages: Message[] = [];
  loadingMore = false;
  page = 0;
  pageSize = 20;
  allLoaded = false;

  ngAfterViewInit() {
    this.loadMessages();
  }

  onScroll() {
    const el = this.messagesContainer.nativeElement;

    if (el.scrollHeight - el.scrollTop === el.clientHeight) {
      this.loadMessages();
    }
  }

  private loadMessages() {
    if (!this.selectedChat) return;

    this.loadingMore = true;

    this.messagesService
      .listMessages(this.selectedChat.id, this.page, this.pageSize)
      .subscribe({
        next: (res: any) => {
          if (res.messages.length < this.pageSize) this.allLoaded = true;

          const el = this.messagesContainer.nativeElement;
          const oldHeight = el.scrollHeight;

          this.messages = [...res.messages, ...this.messages];

          setTimeout(() => {
            const newHeight = el.scrollHeight;
            el.scrollTop = newHeight - oldHeight;
          }, 0);

          this.page++;
          this.loadingMore = false;
        },
        error: () => {
          this.loadingMore = false;
        },
      });
  }

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
            const otherUserId =
              chat.ownerId === currentUser.user.id
                ? chat.recipientId
                : chat.ownerId;
            return this.userService.showUser(otherUserId).pipe(
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
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (!currentUser.user?.id) {
      console.error('Usuário não possui id');
      return;
    }
    if (this.selectedChat && this.selectedChat.id !== chat.id) {
      this.messagesService.leaveChat(this.selectedChat.id);
    }
    this.selectedChat = chat;
    this.chatOpen = true;
    this.messages = [];

    this.messagesService.joinChat(chat.id);

    history.replaceState(null, '', `/home/chat/${chat.id}`);

    this.messagesService.listMessages(chat.id).subscribe({
      next: (res: any) => {
        this.messages = res.messages;
        this.shouldScroll = true;
      },
      error: (err) => console.error('Erro ao carregar mensagens do chat', err),
    });
  }

  closeChat() {
    if (this.selectedChat) {
      this.messagesService.leaveChat(this.selectedChat.id);
    }
    this.chatOpen = false;
    this.router.navigate(['/home']);
  }
  openProfile() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

    if (!currentUser.user?.id) {
      console.error('Usuário não possui id');
      return;
    }

    this.userService.showUser(currentUser.user.id).subscribe({
      next: (user) => {
        const dialogConfig: any = {
          height: '90vh',
          data: { user },
        };

        if (this.isMobile) {
          dialogConfig.width = '100%';
        } else {
          dialogConfig.width = '40vw';
        }

        this.dialog.open(RegisterComponent, dialogConfig);
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

  ngAfterViewChecked() {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  private scrollToBottom() {
    if (this.messagesContainer) {
      this.messagesContainer.nativeElement.scrollTop =
        this.messagesContainer.nativeElement.scrollHeight;
    }
  }
}

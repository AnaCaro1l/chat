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
  PencilLine,
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
import { forkJoin, map, Subject, switchMap, takeUntil } from 'rxjs';
import { ChatCardData } from '../models/chat-card-model';
import { Message, MessagesService } from '../services/messages.service';
import { AuthService } from '../services/auth.service';

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
  readonly pencilLine = PencilLine;

  chatOpen = false;
  menuOpen = true;

  chats: ChatCardData[] = [];
  loadingChats = true;

  selectedChat: ChatCardData | null = null;

  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  private shouldScroll = false;
  isMobile = false;

  private destroy$ = new Subject<void>();

  constructor(
    private messageService: MessageService,
    private router: Router,
    private dialog: MatDialog,
    private userService: UserService,
    private chatsService: ChatsService,
    private messagesService: MessagesService,
    private authService: AuthService
  ) {}
  ngOnInit(): void {
    this.authService.socket?.connect();

    this.loadChats();

    this.checkScreenSize();

    this.chatsService
      .newChat()
      .pipe(takeUntil(this.destroy$))
      .subscribe((showNewChat) => this.addOrUpdateChat(showNewChat));

    this.messagesService
      .onMessage()
      .pipe(takeUntil(this.destroy$))
      .subscribe((msg) => {
        const chat = this.chats.find((c) => c.id === msg.chatId);
        if (chat) chat.lastMessage = msg.body;

        if (this.selectedChat?.id === msg.chatId) {
          this.messages.push(msg);
          setTimeout(() => {
            this.shouldScroll = true;
          });
        }
      });

    this.messagesService
      .onLastMessage()
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ chatId, body }) => {
        const chat = this.chats.find((c) => c.id === chatId);
        if (chat) chat.lastMessage = body;
      });
  }

  addOrUpdateChat(chat: Chat) {
    const otherUserId =
      chat.ownerId === this.getCurrentUserId()
        ? chat.recipientId
        : chat.ownerId;

    const index = this.chats.findIndex((c) => c.id === chat.id);

    const updateChat = (userName: string) => {
      const chatData: ChatCardData = {
        id: chat.id,
        chatName: userName,
        lastMessage: chat.lastMessage || 'Nenhuma mensagem ainda...',
        messages: chat.messages || [],
      };

      if (index > -1) {
        this.chats[index] = chatData;
      } else {
        this.chats.push(chatData);
      }
    };

    if (index > -1 && this.chats[index].chatName !== 'Desconhecido') {
      updateChat(this.chats[index].chatName);
    } else {
      this.userService.showUser(otherUserId).subscribe((user: any) => {
        updateChat(user?.user.name || 'Desconhecido');
      });
    }
  }

  private getCurrentUserId(): number | null {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return currentUser.user?.id || null;
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    if (window.innerWidth < 760) {
      this.menuOpen = false;
      this.isMobile = true;
    } else {
      this.menuOpen = true;
      this.isMobile = false;
    }
  }

  messages: Message[] = [];
  loadingMore = false;
  page = 0;
  pageSize = 20;
  allLoaded = false;

  onScroll() {
    const el = this.messagesContainer.nativeElement;

    if (el.scrollTop <= 5 && !this.loadingMore && !this.allLoaded) {
      this.loadMessages();
    }
  }

  private loadMessages() {
    if (!this.selectedChat || this.loadingMore || this.allLoaded) return;

    this.loadingMore = true;

    const el = this.messagesContainer.nativeElement;
    const oldScrollHeight = el.scrollHeight;

    this.messagesService
      .listMessages(this.selectedChat.id, this.page, this.pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          if (res.messages.length < this.pageSize) {
            this.allLoaded = true;
          }

          const newMessages = res.messages;

          const existingMessageIds = new Set(
            this.messages.map((msg) => msg.id)
          );

          const uniqueNewMessages = newMessages.filter(
            (msg: Message) => !existingMessageIds.has(msg.id)
          );

          this.messages = [...uniqueNewMessages, ...this.messages];

          this.page++;
          this.loadingMore = false;

          setTimeout(() => {
            requestAnimationFrame(() => {
              const newScrollHeight = el.scrollHeight;
              el.scrollTop = newScrollHeight - oldScrollHeight;
            });
          });
        },
        error: () => {
          this.loadingMore = false;
          console.error('Erro ao carregar mensagens');
        },
      });
  }

  loadChats() {
    const currentUser = this.getCurrentUserId();

    if (!currentUser) {
      console.error('Usuário não possui id');
      return;
    }

    this.chatsService
      .getChats(currentUser)
      .pipe(
        switchMap((response: any) => {
          const chatsArray = response.chats;

          const chatsWithNames$ = chatsArray.map((chat: Chat) => {
            const otherUserId =
              chat.ownerId === currentUser ? chat.recipientId : chat.ownerId;
            return this.userService.showUser(otherUserId).pipe(
              map((user: any) => {
                return {
                  id: chat.id,
                  chatName: user?.user.name || 'Desconhecido',
                  lastMessage: chat.lastMessage || 'Nenhuma mensagem ainda...',
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
    this.authService.disconnect();
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
    const currentUser = this.getCurrentUserId();
    if (!currentUser) {
      console.error('Usuário não possui id');
      return;
    }
    if (this.selectedChat && this.selectedChat.id !== chat.id) {
      this.messagesService.leaveChat(this.selectedChat.id);
    }
    this.selectedChat = chat;
    this.messagesService.joinChat(chat.id);

    this.chatOpen = true;
    this.messages = [];
    this.page = 0;
    this.allLoaded = false;

    history.replaceState(null, '', `/home/chat/${chat.id}`);

    this.messagesService
      .listMessages(this.selectedChat.id, this.page, this.pageSize)
      .subscribe({
        next: (res: any) => {
          this.messages = res.messages;
          this.shouldScroll = true;
        },
        error: () => {
          console.error('Erro ao carregar mensagens iniciais');
        },
      });
  }

  closeChat() {
    if (this.selectedChat) {
      this.chatsService.leaveChat(this.selectedChat.id);
    }
    this.chatOpen = false;
    this.router.navigate(['/home']);
  }
  openProfile() {
    const currentUser = this.getCurrentUserId();

    if (!currentUser) {
      console.error('Usuário não possui id');
      return;
    }

    this.userService.showUser(currentUser).subscribe({
      next: (user) => {
        const dialogConfig: any = {
          height: '90vh',
          data: { user },
        };

        if (this.isMobile) {
          dialogConfig.height = '80vh';
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
    if (this.shouldScroll && !this.loadingMore) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  private scrollToBottom() {
    if (this.messagesContainer) {
      const el = this.messagesContainer.nativeElement;
      el.scrollTop = el.scrollHeight;
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

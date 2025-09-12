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
import { HttpClientModule } from '@angular/common/http';

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
    HttpClientModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone: true,
  providers: [MessageService, UserService],
})
export class HomeComponent implements OnInit {
  readonly messageCircleX = MessageCircleX;
  readonly logOut = LogOut;
  readonly userPen = UserPen;
  readonly messagePlus = MessageCirclePlus;

  chatOpen = false;

  constructor(
    private messageService: MessageService,
    private router: Router,
    private dialog: MatDialog,
    private userService: UserService
  ) {}

  ngOnInit(): void {}

  messages = [
    { text: 'Oi, tudo bem?', fromMe: false },
    { text: 'Tudo sim! E você?', fromMe: true },
    { text: 'Também, obrigado!', fromMe: false },
  ];

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

  openChat() {
    this.chatOpen = true;
  }

  openProfile() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (!currentUser?.id) return;

    this.userService.getUserById(currentUser.id).subscribe({
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
}

import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { BadgeModule } from 'primeng/badge';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { ChatCardData } from '../../models/chat-card-model';

@Component({
  selector: 'app-chat-card',
  imports: [LucideAngularModule, BadgeModule, OverlayBadgeModule, NgIf],
  templateUrl: './chat-card.component.html',
  styleUrl: './chat-card.component.scss',
  standalone: true,
  providers: [],
})
export class ChatCardComponent {
  @Input() chatName!: string;
  @Input() lastMessage!: string;
  @Input() unreadCount: number = 0;

  @Input() chat!: ChatCardData;
  @Output() cardClick = new EventEmitter<ChatCardData>();

  onClick() {
    this.cardClick.emit(this.chat);
  }
}

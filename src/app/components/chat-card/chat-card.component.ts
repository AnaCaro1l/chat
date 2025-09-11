import { Component } from '@angular/core';
import { LucideAngularModule, MessageCircle } from "lucide-angular";
import { BadgeModule } from 'primeng/badge';
import { OverlayBadgeModule } from 'primeng/overlaybadge';

@Component({
  selector: 'app-chat-card',
  imports: [LucideAngularModule, BadgeModule, OverlayBadgeModule],
  templateUrl: './chat-card.component.html',
  styleUrl: './chat-card.component.scss'
})
export class ChatCardComponent {  
  readonly messageCircle = MessageCircle;

}

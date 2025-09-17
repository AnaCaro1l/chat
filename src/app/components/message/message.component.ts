import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { LucideAngularModule, User } from 'lucide-angular';
import { Message } from '../../services/messages.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-message',
  imports: [LucideAngularModule, NgClass, DatePipe],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss',
})
export class MessageComponent {
  readonly user = User;

  @Input() message?: Message;

  get content(): string | undefined {
    return this.message?.body;
  }

  get time(): Date | undefined {
    return this.message?.createdAt;
  }

  get type(): string {
    return this.message?.fromMe ? 'sent' : 'received';
  }
}

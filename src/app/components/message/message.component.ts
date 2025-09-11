import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { LucideAngularModule, User } from "lucide-angular";

@Component({
  selector: 'app-message',
  imports: [LucideAngularModule, NgClass],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})
export class MessageComponent {
  readonly user = User;

  @Input() content!: string;
  @Input() type: 'sent' | 'received' = 'received';
}

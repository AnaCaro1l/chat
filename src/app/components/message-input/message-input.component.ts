import { Component } from '@angular/core';
import { LucideAngularModule, MessageCircle, SendHorizontal } from "lucide-angular";
import { MatButtonModule } from "@angular/material/button";
import { MatIconButton } from '@angular/material/button';

@Component({
  selector: 'app-message-input',
  imports: [LucideAngularModule, MatButtonModule, MatIconButton],
  templateUrl: './message-input.component.html',
  styleUrl: './message-input.component.scss'
})
export class MessageInputComponent {
  readonly messageCircle = MessageCircle;
  readonly sendHorizontal = SendHorizontal
}

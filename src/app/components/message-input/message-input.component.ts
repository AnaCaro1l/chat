import { Component } from '@angular/core';
import { LucideAngularModule, MessageCircle, SendHorizontal } from "lucide-angular";
import { MatButtonModule } from "@angular/material/button";
import { MatIconButton } from '@angular/material/button';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';


@Component({
  selector: 'app-message-input',
  imports: [LucideAngularModule, MatButtonModule, MatIconButton, ReactiveFormsModule],
  templateUrl: './message-input.component.html',
  styleUrl: './message-input.component.scss'
})
export class MessageInputComponent {
  readonly messageCircle = MessageCircle;
  readonly sendHorizontal = SendHorizontal;

  newMessageForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.newMessageForm = this.formBuilder.group({
      message: ['', Validators.required],
    });
  }

  sendMessage() {
    if (this.newMessageForm.valid) {
      const message = this.newMessageForm.value.message;
      console.log('Mensagem enviada:', message);
      this.newMessageForm.reset();
    }
  }
}

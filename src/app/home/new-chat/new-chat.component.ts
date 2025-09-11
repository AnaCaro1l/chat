import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-chat',
  imports: [ReactiveFormsModule],
  templateUrl: './new-chat.component.html',
  styleUrl: './new-chat.component.scss'
})
export class NewChatComponent {
  newChatForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.newChatForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  createNewChat() {
    if (this.newChatForm.valid) {
      const email = this.newChatForm.value.email;
      // Lógica para criar um novo chat com o email fornecido
    }
  }
}

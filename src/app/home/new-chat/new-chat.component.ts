import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChatsService } from '../../services/chats.service';
import { DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'app-new-chat',
  imports: [ReactiveFormsModule],
  templateUrl: './new-chat.component.html',
  styleUrl: './new-chat.component.scss',
  providers: [ChatsService]
})
export class NewChatComponent {
  newChatForm: FormGroup;

  constructor(private fb: FormBuilder, private chatsService: ChatsService, private dialogRef: DialogRef) {
    this.newChatForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  createNewChat() {
    if (this.newChatForm.valid) {
      const email = this.newChatForm.value.email;
      
      const ownerId = JSON.parse(localStorage.getItem('currentUser') || '{}').user.id;
      if (!ownerId) {
        console.error('Owner ID not found in local storage.');
        return;
      }

      this.chatsService.createChat(ownerId, email).subscribe({
        next: (chat) => {
          console.log('Chat created successfully:', chat);
          this.dialogRef.close();
        },
        error: (err) => {
          console.error('Error creating chat:', err);
          console.log('Owner ID:', ownerId, 'Email:', email);
        }
      })
    }
  }
}

import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import {
  LucideAngularModule,
  MessageCircle,
  SendHorizontal,
} from 'lucide-angular';
import { MatButtonModule } from '@angular/material/button';
import { MatIconButton } from '@angular/material/button';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-message-input',
  imports: [
    LucideAngularModule,
    MatButtonModule,
    MatIconButton,
    ReactiveFormsModule,
  ],
  templateUrl: './message-input.component.html',
  styleUrl: './message-input.component.scss',
  standalone: true,
})
export class MessageInputComponent {
  readonly messageCircle = MessageCircle;
  readonly sendHorizontal = SendHorizontal;

  newMessageForm: FormGroup;

  @Output() messageSent = new EventEmitter<string>();

  @ViewChild('textarea') textarea!: ElementRef;
  constructor(private formBuilder: FormBuilder) {
    this.newMessageForm = this.formBuilder.group({
      message: ['', Validators.required],
    });
  }

  sendMessage() {
    if (this.newMessageForm.valid) {
      const message = this.newMessageForm.value.message;

      this.messageSent.emit(message);

      this.newMessageForm.reset();

      if(this.textarea) {
        const nativeElement = this.textarea.nativeElement;
        nativeElement.style.height = 'auto'
      }
    }
  }

  onInput(): void {
    const nativeElement = this.textarea.nativeElement;
    nativeElement.style.height = 'auto'; 
    nativeElement.style.height = `${nativeElement.scrollHeight}px`;
  }

  sendMessageOnEnter(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }
}

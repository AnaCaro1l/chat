import { NgClass, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  LucideAngularModule,
  User,
  Plus,
  PencilLine,
  Trash2,
} from 'lucide-angular';
import { Message, MessagesService } from '../../services/messages.service';
import { DatePipe } from '@angular/common';
import { MessageService } from 'primeng/api';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EditMessageComponent } from '../edit-message/edit-message.component';

@Component({
  selector: 'app-message',
  imports: [LucideAngularModule, NgClass, DatePipe, MatDialogModule, NgIf],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss',
})
export class MessageComponent {
  readonly user = User;
  readonly plus = Plus;
  readonly pencilLine = PencilLine;
  readonly trash = Trash2;

  canView = false;

  @Input() message?: Message;
  @Output() messageEdited = new EventEmitter<{ id: number; body: string }>();
  @Output() messageDeleted = new EventEmitter<number>();

  constructor(
    private messagesServices: MessagesService,
    private messageService: MessageService,
    private dialog: MatDialog
  ) {}

  get content(): string | undefined {
    return this.message?.body;
  }

  get time(): Date | undefined {
    return this.message?.createdAt;
  }

  get type(): string {
    return this.message?.fromMe ? 'sent' : 'received';
  }

  editMessage() {
    if (!this.message) return;

    const dialogRef = this.dialog.open(EditMessageComponent, {
      width: '400px',
      data: { message: this.message },
    });

    dialogRef.afterClosed().subscribe((updatedBody: string) => {
      if (updatedBody) {
        this.message!.body = updatedBody;
        this.messagesServices
          .updateMessage(this.message!.id, updatedBody)
          .subscribe({
            next: () => {
              this.messageEdited.emit({
                id: this.message!.id,
                body: updatedBody,
              });
            },
            error: (err) => console.error('Erro ao atualizar mensagem', err),
          });
      }
    });
  }

  deleteMessage() {
    if (!this.message) return;

    this.messagesServices.deleteMessage(this.message.id).subscribe({
      next: () => this.messageDeleted.emit(this.message!.id),
      error: (err) => console.error('Erro ao deletar mensagem', err),
    });
  }
}

// edit-message.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Message } from '../../services/messages.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-edit-message',
  imports: [ReactiveFormsModule, MatButtonModule],
  templateUrl: './edit-message.component.html',
  styleUrls: ['./edit-message.component.scss'],
  standalone: true,
})
export class EditMessageComponent {
  editForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditMessageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: Message }
  ) {
    this.editForm = this.fb.group({
      message: [data.message.body],
    });
  }

  save() {
    if (this.editForm.valid) {
      this.dialogRef.close(this.editForm.value.message);
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}

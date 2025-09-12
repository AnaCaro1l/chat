import { NgClass, NgIf } from '@angular/common';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router, RouterLink } from '@angular/router';
import { LucideAngularModule, Eye, EyeOff, User, Mail } from 'lucide-angular';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    MatButtonModule,
    LucideAngularModule,
    RouterLink,
    ToastModule,
    ReactiveFormsModule,
    NgIf,
    NgClass,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [MessageService],
})
export class RegisterComponent implements OnInit {
  readonly Eye = Eye;
  readonly EyeOff = EyeOff;
  readonly user = User;
  readonly mail = Mail;

  viewPassword = false;
  viewPasswordConfirm = false;

  registerForm: FormGroup;

  isEditMode = false;
  originalUsername: string = '';

  constructor(
    private messageService: MessageService,
    private router: Router,
    private fb: FormBuilder,
    @Optional() private dialogRef?: MatDialogRef<RegisterComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data?: any
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const user = this.data?.user || history.state.user;

    if (user) {
      this.isEditMode = true;
      this.originalUsername = user.username;

      this.registerForm.patchValue({
        email: user.email,
        username: user.username,
        password: user.password,
        confirmPassword: user.confirmPassword,
      });
    }
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const { email, username, password, confirmPassword } =
        this.registerForm.value;

      const formData = {
        email,
        username,
        password,
        confirmPassword,
      };

      const usersData = localStorage.getItem('users');
      let users = usersData ? JSON.parse(usersData) : [];

      if (this.isEditMode) {
        const index = users.findIndex(
          (u: any) => u.username === this.originalUsername
        );
        if (index !== -1) {
          users[index] = formData;
          localStorage.setItem('users', JSON.stringify(users));

          localStorage.setItem('currentUser', JSON.stringify(formData));

          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Usuário atualizado com sucesso',
          });
          if (this.dialogRef) {
            this.dialogRef.close();
          } else {
            this.router.navigate(['/home']); 
          }
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Usuário não encontrado',
          });
        }
      } else {
        const exists = users.find((u: any) => u.username === formData.username);
        if (exists) {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Usuário já cadastrado',
          });
          return;
        }

        users.push(formData);
        localStorage.setItem('users', JSON.stringify(users));
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Cadastro realizado com sucesso',
        });
        this.router.navigate(['/login']);
      }
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Por favor, preencha todos os campos corretamente.',
      });
    }
  }

  togglePasswordVisibility() {
    this.viewPassword = !this.viewPassword;
  }

  togglePasswordConfirmVisibility() {
    this.viewPasswordConfirm = !this.viewPasswordConfirm;
  }
}

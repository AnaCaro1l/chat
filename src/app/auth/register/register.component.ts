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
import { UserService } from '../../services/user.service';
import { HttpClientModule } from '@angular/common/http';

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
    HttpClientModule,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [MessageService, UserService],
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
    private userService: UserService,
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
        username: user.name,
        password: user.password,
        confirmPassword: user.confirmPassword,
      });
    }
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const { email, username, password, confirmPassword } =
        this.registerForm.value;

      if (password !== confirmPassword) {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'As senhas não coincidem.',
        });
        return;
      }

      const formData = {
        name: username,
        email,
        password,
      };

      console.log(this.isEditMode);

      if (this.isEditMode && this.data?.user?.id) {
        console.log('Perfil atualizado com sucesso');

        this.userService.updateUser(this.data.user.id, formData).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Perfil atualizado com sucesso',
            });
            if (this.dialogRef) {
              this.dialogRef.close(formData);
            } else {
              this.router.navigate(['/home']);
            }
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: err.error.message || 'Erro ao atualizar perfil',
            });
          },
        });
      } else {
        console.log('Perfil atualizado com sucesso');

        this.userService.createUser(formData).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Cadastro realizado com sucesso',
            });
            this.router.navigate(['/login']);
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: err.error.message || 'Erro ao cadastrar usuário',
            });
          },
        });
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

import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { LucideAngularModule, Eye, EyeOff, User } from 'lucide-angular';
import {
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { UserService } from '../../services/user.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatButtonModule,
    LucideAngularModule,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    ToastModule,
    HttpClientModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [MessageService, UserService],
})
export class LoginComponent {
  readonly Eye = Eye;
  readonly EyeOff = EyeOff;
  readonly user = User;

  viewPassword = false;
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private userService: UserService
  ) {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    const { email, password } = this.loginForm.value;

    this.userService.login(email, password).subscribe({
      next: (user) => {
        localStorage.setItem('auth', 'true');
        localStorage.setItem('currentUser', JSON.stringify(user)); // user vem do backend com id
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: err.error.message || 'Usuário ou senha incorretos',
          life: 3000,
        });
      },
    });
  }

  showError(message: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Erro',
      detail: message,
      life: 3000,
    });
  }

  togglePasswordVisibility() {
    this.viewPassword = !this.viewPassword;
  }
}

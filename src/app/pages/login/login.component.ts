import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/core/services/auth.service';
import { LoginParams } from 'src/app/core/interfaces/login';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    NgxMaskDirective
  ],
  providers: [provideNgxMask()],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  busy = false;
  hidePassword = true;

  loginForm: FormGroup = this.fb.group({
    cpf: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(14)]],
    pass: ['', [Validators.required, Validators.minLength(6)]]
  });

  ngOnInit(): void {
    if (localStorage.getItem('MasonUser')) {
      this.router.navigate(['/home']);
    }
  }

  showMessage(msg: string, isError: boolean = false): void {
    this.snackBar.open(msg, '✕', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: isError ? 'msg-error' : 'msg-success'
    });
  }

  login(): void {
    if (this.loginForm.invalid || this.busy) return;

    this.busy = true;
    const { cpf, pass } = this.loginForm.value;
    
    const login: LoginParams = {
      cpf: cpf.replace(/[^\d]/g, ''),
      pass: pass
    };

    this.authService.login(login).subscribe({
      next: (data) => {
        localStorage.setItem('MasonUser', JSON.stringify(data));
        const welcomeMsg = data.titulo 
          ? `Bem-vindo Ir. ${data.titulo} ${data.nome}`
          : `Bem-vindo Ir. ${data.nome}`;
        
        this.showMessage(welcomeMsg, false);
        this.router.navigate(['/home']);
        this.busy = false;
      },
      error: (error) => {
        this.showMessage(error?.message || 'Usuário ou senha inválidos!', true);
        this.busy = false;
      }
    });
  }

  limpar(): void {
    this.loginForm.reset();
  }
}

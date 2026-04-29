import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/core/services/auth.service';
import { ModalTokenComponent } from '../modal-token/modal-token.component';
import { Observable, catchError, of, tap } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  currentUser: any = null;
  exibeHamb = false;

  ngOnInit(): void {
    const local: any = localStorage.getItem('MasonUser');
    if (local) {
      this.currentUser = JSON.parse(local);
      this.verificaAtivo();
    } else {
      this.router.navigate(['/login']);
    }
  }

  private verificaAtivo(): void {
    this.authService.verificaAtivo(this.currentUser.id).pipe(
      tap(() => {}),
      catchError(() => {
        localStorage.removeItem('MasonUser');
        this.router.navigate(['/login']);
        return of(null);
      })
    ).subscribe();
  }

  showHamb(): void {
    this.exibeHamb = !this.exibeHamb;
  }

  setDefaultImage(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/images/default-avatar.png';
  }

  sair(): void {
    localStorage.removeItem('MasonUser');
    this.router.navigate(['/login']);
  }

  gerarToken(): void {
    const token = 'https://restrito.glumbsp.com.br/cadastro/candidato/';
    this.authService.gerarToken(this.currentUser.id).pipe(
      tap(data => {
        this.abrirModal(token + data);
      }),
      catchError(error => {
        const errorToken = token + (error?.error?.text || 'erro');
        this.abrirModal(errorToken);
        return of(null);
      })
    ).subscribe();
  }

  private abrirModal(token: string): void {
    this.dialog.open(ModalTokenComponent, {
      data: { link: token }
    });
  }

  showMessage(msg: string, isError: boolean = false): void {
    this.snackBar.open(msg, '✕', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: isError ? 'msg-error' : 'msg-success'
    });
  }
}

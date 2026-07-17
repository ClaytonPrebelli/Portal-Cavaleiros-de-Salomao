import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/core/services/auth.service';
import { Envs } from 'src/app/core/services/envs';
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
  private destroyRef = inject(DestroyRef);
  private authService = inject(AuthService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  currentUser: any = null;
  exibeHamb = false;
  fotosUrl = Envs.fotosUrl;

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
      takeUntilDestroyed(this.destroyRef),
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
    img.onerror = null;
    img.src = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v1.2c0 .66.54 1.2 1.2 1.2h16.8c.66 0 1.2-.54 1.2-1.2v-1.2c0-3.2-6.4-4.8-9.6-4.8z"/></svg>');
  }

  sair(): void {
    localStorage.removeItem('MasonUser');
    this.router.navigate(['/login']);
  }

  gerarToken(): void {
    const token = 'https://restrito.gosp.com.br/cadastro/candidato/';
    this.authService.gerarToken(this.currentUser.id).pipe(
      takeUntilDestroyed(this.destroyRef),
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

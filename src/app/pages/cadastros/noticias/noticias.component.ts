import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NoticiasService } from 'src/app/core/services/noticias.service';
import { NoticiasInterface, NoticiasResponse } from 'src/app/core/interfaces/noticias';
import { Observable, catchError, finalize, of, tap } from 'rxjs';

@Component({
  selector: 'app-noticias',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatTooltipModule,
    MatSnackBarModule
  ],
  templateUrl: './noticias.component.html',
  styleUrls: ['./noticias.component.scss']
})
export class NoticiasComponent implements OnInit {
  private noticiasService = inject(NoticiasService);
  private snackBar = inject(MatSnackBar);

  busy = false;
  page = 1;
  pageSize = 10;

  listaView!: NoticiasResponse;
  displayedColumns: string[] = ['id', 'titulo', 'data', 'acoes'];

  ngOnInit(): void {
    this.loadNoticias();
  }

  loadNoticias(): void {
    this.busy = true;
    this.noticiasService.listarNoticias(this.page, this.pageSize)
      .pipe(
        tap(data => {
          this.listaView = data;
          if (data.noticias.length === 0) {
            this.showMessage('Nenhuma notícia encontrada!', true);
          }
        }),
        catchError(error => {
          this.showMessage('Erro ao carregar notícias!', true);
          return of(null);
        }),
        finalize(() => this.busy = false)
      )
      .subscribe();
  }

  showMessage(msg: string, isError: boolean = false): void {
    this.snackBar.open(msg, '✕', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: isError ? 'msg-error' : 'msg-success'
    });
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('pt-BR');
  }

  getRowCount(): number[] {
    return this.listaView ? Array(this.listaView.pageSize).fill(0) : [];
  }
}

import { Component, DestroyRef, OnInit, inject } from '@angular/core';
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
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ComunicadosService } from 'src/app/core/services/comunicados.service';
import { ComunicadoInterface } from 'src/app/core/interfaces/comunicados';
import { catchError, finalize, of, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-comunicados',
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
    MatSnackBarModule,
    MatDialogModule
  ],
  templateUrl: './comunicados.component.html',
  styleUrls: ['./comunicados.component.scss']
})
export class ComunicadosComponent implements OnInit {
  private comunicadosService = inject(ComunicadosService);
  private snackBar = inject(MatSnackBar);
  private destroyRef = inject(DestroyRef);

  busy = false;
  lista: ComunicadoInterface[] = [];
  displayedColumns: string[] = ['id', 'titulo', 'graus', 'data', 'acoes'];

  ngOnInit(): void {
    this.loadComunicados();
  }

  loadComunicados(): void {
    this.busy = true;
    this.comunicadosService.listarTodos()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(data => {
          this.lista = data;
        }),
        catchError(error => {
          this.showMessage('Erro ao carregar comunicados!', true);
          return of([]);
        }),
        finalize(() => this.busy = false)
      )
      .subscribe();
  }

  formatGraus(graus: string): string {
    if (!graus) return '';
    return graus.split(',').map(g => g.trim()).join(', ');
  }

  excluir(id: number): void {
    if (!confirm('Tem certeza que deseja excluir este comunicado?')) return;

    this.comunicadosService.deletarComunicado(id)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(() => {
          this.showMessage('Comunicado excluído com sucesso!');
          this.loadComunicados();
        }),
        catchError(() => {
          this.showMessage('Erro ao excluir comunicado!', true);
          return of(null);
        })
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
}

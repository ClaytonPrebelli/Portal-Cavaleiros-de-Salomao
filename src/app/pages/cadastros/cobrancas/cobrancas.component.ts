import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CobrancasService } from 'src/app/core/services/cobrancas.service';
import { CobrancaInterface } from 'src/app/core/interfaces/login';
import { CapitalizePipe } from 'src/app/core/pipes/capitalize.pipe';
import { catchError, finalize, of, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-cobrancas',
  standalone: true,
  imports: [
    CommonModule, RouterLink, FormsModule,
    MatTableModule, MatCardModule, MatButtonModule, MatIconModule,
    MatProgressSpinnerModule, MatChipsModule, MatTooltipModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatSnackBarModule, CapitalizePipe
  ],
  templateUrl: './cobrancas.component.html',
  styleUrls: ['./cobrancas.component.scss']
})
export class CobrancasComponent implements OnInit {
  private cobrancasService = inject(CobrancasService);
  private snackBar = inject(MatSnackBar);
  private destroyRef = inject(DestroyRef);

  busy = false;
  lista: CobrancaInterface[] = [];
  displayedColumns: string[] = ['id', 'descricao', 'mesRef', 'membro', 'valor', 'vencimento', 'status', 'acoes'];

  filtroCategoria: number | null = null;
  filtroPago: string = '';
  categorias: any[] = [];

  ngOnInit(): void {
    this.loadCategorias();
    this.loadCobrancas();
  }

  loadCategorias(): void {
    this.cobrancasService.listarCategorias()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(data => this.categorias = data),
        catchError(() => of([]))
      )
      .subscribe();
  }

  loadCobrancas(): void {
    this.busy = true;
    const catId = this.filtroCategoria;
    const paga = this.filtroPago === '' ? undefined : this.filtroPago === 'true';

    this.cobrancasService.listarTodas(catId ?? undefined, paga)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(data => this.lista = data),
        catchError(() => {
          this.showMessage('Erro ao carregar cobranças!', true);
          return of([]);
        }),
        finalize(() => this.busy = false)
      )
      .subscribe();
  }

  marcarPaga(id: number): void {
    const hoje = new Date().toISOString();
    this.cobrancasService.marcarComoPaga(id, hoje)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(() => {
          this.showMessage('Cobrança marcada como paga!');
          this.loadCobrancas();
        }),
        catchError(() => {
          this.showMessage('Erro ao marcar como paga!', true);
          return of(null);
        })
      )
      .subscribe();
  }

  excluir(id: number): void {
    if (!confirm('Tem certeza que deseja excluir esta cobrança?')) return;
    this.cobrancasService.deletar(id)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(() => {
          this.showMessage('Cobrança excluída!');
          this.loadCobrancas();
        }),
        catchError(() => {
          this.showMessage('Erro ao excluir!', true);
          return of(null);
        })
      )
      .subscribe();
  }

  showMessage(msg: string, isError = false): void {
    this.snackBar.open(msg, '✕', {
      duration: 4000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: isError ? 'msg-error' : 'msg-success'
    });
  }

  totalPendente(): number {
    return this.lista.filter(c => !c.pago).reduce((sum, c) => sum + c.valor, 0);
  }

  totalPago(): number {
    return this.lista.filter(c => c.pago).reduce((sum, c) => sum + c.valor, 0);
  }
}

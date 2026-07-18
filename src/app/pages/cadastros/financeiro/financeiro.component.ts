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
import { FinanceiroService } from 'src/app/core/services/financeiro.service';
import { CobrancasService } from 'src/app/core/services/cobrancas.service';
import { FinanceiroInterface } from 'src/app/core/interfaces/financeiro';
import { CapitalizePipe } from 'src/app/core/pipes/capitalize.pipe';
import { catchError, finalize, forkJoin, of, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-financeiro',
  standalone: true,
  imports: [
    CommonModule, RouterLink, FormsModule,
    MatTableModule, MatCardModule, MatButtonModule, MatIconModule,
    MatProgressSpinnerModule, MatChipsModule, MatTooltipModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatSnackBarModule, CapitalizePipe
  ],
  templateUrl: './financeiro.component.html',
  styleUrls: ['./financeiro.component.scss']
})
export class FinanceiroComponent implements OnInit {
  private financeiroService = inject(FinanceiroService);
  private cobrancasService = inject(CobrancasService);
  private snackBar = inject(MatSnackBar);
  private destroyRef = inject(DestroyRef);

  busy = false;
  lista: FinanceiroInterface[] = [];
  displayedColumns: string[] = ['id', 'tipo', 'descricao', 'categoria', 'valor', 'data', 'membro', 'status', 'acoes'];

  filtroMes: number | null = null;
  filtroAno: number | null = null;
  filtroTipo: string = '';
  filtroPago: string = '';

  saldo = 0;
  totalEntradas = 0;
  totalSaidas = 0;
  totalAPagar = 0;
  totalAReceber = 0;

  meses = [
    { value: 1, label: 'Janeiro' }, { value: 2, label: 'Fevereiro' },
    { value: 3, label: 'Março' }, { value: 4, label: 'Abril' },
    { value: 5, label: 'Maio' }, { value: 6, label: 'Junho' },
    { value: 7, label: 'Julho' }, { value: 8, label: 'Agosto' },
    { value: 9, label: 'Setembro' }, { value: 10, label: 'Outubro' },
    { value: 11, label: 'Novembro' }, { value: 12, label: 'Dezembro' }
  ];
  anos = [2025, 2026, 2027];

  ngOnInit(): void {
    const now = new Date();
    this.filtroMes = now.getMonth() + 1;
    this.filtroAno = now.getFullYear();
    this.loadData();
  }

  loadData(): void {
    this.busy = true;
    const mes = this.filtroMes ?? undefined;
    const ano = this.filtroAno ?? undefined;
    const tipo = this.filtroTipo || undefined;
    const pago = this.filtroPago === '' ? undefined : this.filtroPago === 'true';

    forkJoin({
      financeiro: this.financeiroService.listarTodos(mes, ano, tipo, pago),
      cobrancas: this.cobrancasService.listarTodas(undefined, false)
    })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(({ financeiro, cobrancas }) => {
          this.lista = financeiro;
          this.totalEntradas = financeiro.filter(d => d.tipo === 'Entrada' && d.pago).reduce((s, d) => s + d.valor, 0);
          this.totalSaidas = financeiro.filter(d => d.tipo === 'Saida' && d.pago).reduce((s, d) => s + d.valor, 0);
          this.totalAPagar = financeiro.filter(d => d.tipo === 'Saida' && !d.pago).reduce((s, d) => s + d.valor, 0);
          this.totalAReceber = financeiro.filter(d => d.tipo === 'Entrada' && !d.pago).reduce((s, d) => s + d.valor, 0);
        }),
        catchError(() => {
          this.showMessage('Erro ao carregar financeiro!', true);
          return of({ financeiro: [], cobrancas: [] });
        }),
        finalize(() => {
          this.financeiroService.obterSaldo(mes, ano)
            .pipe(
              takeUntilDestroyed(this.destroyRef),
              tap(data => this.saldo = data.saldo),
              catchError(() => of(0)),
              finalize(() => this.busy = false)
            )
            .subscribe();
        })
      )
      .subscribe();
  }

  excluir(id: number): void {
    if (!confirm('Tem certeza que deseja excluir este lançamento?')) return;
    this.financeiroService.deletar(id)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(() => {
          this.showMessage('Lançamento excluído!');
          this.loadData();
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
      duration: 4000, horizontalPosition: 'center', verticalPosition: 'top',
      panelClass: isError ? 'msg-error' : 'msg-success'
    });
  }

  marcarComoPago(id: number): void {
    const hoje = new Date().toISOString();
    this.financeiroService.marcarComoPago(id, hoje)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(() => {
          this.showMessage('Lançamento marcado como pago!');
          this.loadData();
        }),
        catchError(() => {
          this.showMessage('Erro ao marcar como pago!', true);
          return of(null);
        })
      )
      .subscribe();
  }
}

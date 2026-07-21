import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FrequenciaService } from 'src/app/core/services/frequencia.service';
import { FrequenciaHistoricoInterface } from 'src/app/core/interfaces/frequencia';
import { CapitalizePipe } from 'src/app/core/pipes/capitalize.pipe';
import { catchError, finalize, of, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-frequencia-historico',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatDialogModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatButtonModule, MatIconModule,
    MatProgressSpinnerModule, MatTableModule, MatTooltipModule,
    CapitalizePipe
  ],
  templateUrl: './frequencia-historico.component.html',
  styleUrls: ['./frequencia-historico.component.scss']
})
export class FrequenciaHistoricoComponent implements OnInit {
  private frequenciaService = inject(FrequenciaService);
  private destroyRef = inject(DestroyRef);
  private dialogRef = inject(MatDialogRef<FrequenciaHistoricoComponent>);

  busy = false;

  dataInicio = '';
  dataFim = '';

  meses = [
    { value: 1, label: 'Janeiro' }, { value: 2, label: 'Fevereiro' },
    { value: 3, label: 'Março' }, { value: 4, label: 'Abril' },
    { value: 5, label: 'Maio' }, { value: 6, label: 'Junho' },
    { value: 7, label: 'Julho' }, { value: 8, label: 'Agosto' },
    { value: 9, label: 'Setembro' }, { value: 10, label: 'Outubro' },
    { value: 11, label: 'Novembro' }, { value: 12, label: 'Dezembro' }
  ];
  anos = [2025, 2026, 2027];

  mesInicio = 1;
  anoInicio = 2026;
  mesFim = new Date().getMonth() + 1;
  anoFim = new Date().getFullYear();

  lista: FrequenciaHistoricoInterface[] = [];
  displayedColumns = ['nome', 'cargo', 'reunioes', 'presencas', 'percentual'];

  ngOnInit(): void {
    const hoje = new Date();
    this.anoFim = hoje.getFullYear();
    this.mesFim = hoje.getMonth() + 1;
    this.anoInicio = hoje.getFullYear();
    this.mesInicio = 1;
  }

  getCorPercentual(pct: number): string {
    if (pct >= 75) return 'cor-alta';
    if (pct >= 50) return 'cor-media';
    return 'cor-baixa';
  }

  getBarWidth(pct: number): string {
    return Math.min(pct, 100) + '%';
  }

  buscar(): void {
    this.busy = true;
    const inicio = new Date(this.anoInicio, this.mesInicio - 1, 1).toISOString().split('T')[0];
    const fim = new Date(this.anoFim, this.mesFim, 0).toISOString().split('T')[0];

    this.frequenciaService.listarHistorico(inicio, fim)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(data => this.lista = data),
        catchError(() => {
          this.lista = [];
          return of([]);
        }),
        finalize(() => this.busy = false)
      )
      .subscribe();
  }

  fechar(): void {
    this.dialogRef.close();
  }

  totalPresencas(): number {
    return this.lista.reduce((sum, x) => sum + x.presencas, 0);
  }

  totalReunioes(): number {
    return this.lista.length > 0 ? this.lista[0].totalReunioes : 0;
  }

  mediaGeral(): number {
    if (this.lista.length === 0) return 0;
    return Math.round(this.lista.reduce((sum, x) => sum + x.percentual, 0) / this.lista.length * 10) / 10;
  }
}

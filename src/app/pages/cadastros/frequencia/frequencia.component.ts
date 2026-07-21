import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { FrequenciaService } from 'src/app/core/services/frequencia.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { FrequenciaInterface } from 'src/app/core/interfaces/frequencia';
import { UsuariosInterface } from 'src/app/core/interfaces/login';
import { CapitalizePipe } from 'src/app/core/pipes/capitalize.pipe';
import { FrequenciaHistoricoComponent } from '../frequencia-historico/frequencia-historico.component';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-frequencia',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatCardModule, MatButtonModule, MatIconModule,
    MatSelectModule, MatFormFieldModule, MatInputModule,
    MatProgressSpinnerModule, MatTooltipModule,
    MatSnackBarModule, MatSlideToggleModule, MatDialogModule, CapitalizePipe
  ],
  templateUrl: './frequencia.component.html',
  styleUrls: ['./frequencia.component.scss']
})
export class FrequenciaComponent implements OnInit {
  private frequenciaService = inject(FrequenciaService);
  private usuariosService = inject(AuthService);
  private snackBar = inject(MatSnackBar);
  private destroyRef = inject(DestroyRef);
  private dialog = inject(MatDialog);

  busy = false;
  saving = false;

  filtroMes = new Date().getMonth() + 1;
  filtroAno = new Date().getFullYear();

  datasReuniao: string[] = [];
  dataSelecionada: string = '';
  registros: FrequenciaInterface[] = [];
  membros: UsuariosInterface[] = [];
  membrosComPresenca: { membro: UsuariosInterface; presente: boolean; registroId: number | null; observacao: string; tipoSessao: string }[] = [];

  tipoSessaoSelecionado = 'Sessão Regular';
  tiposSessao = [
    'Sessão Regular',
    'Magna Pública',
    'Sessão de Iniciação',
    'Sessão de Passagem A Companheiro',
    'Elevação a Mestre'
  ];

  totalPresentes = 0;
  totalMembros = 0;

  showAddData = false;
  novaData = '';

  showVisitaModal = false;
  visitaMembroIndex = -1;
  visitaLoja = '';

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
    this.loadDatasReuniao();
    this.loadMembros();
  }

  loadDatasReuniao(): void {
    this.busy = true;
    this.frequenciaService.listarDatasReuniao(this.filtroMes, this.filtroAno)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(datas => {
          this.datasReuniao = datas;
          if (datas.length > 0 && !this.dataSelecionada) {
            const hoje = new Date().toISOString().split('T')[0];
            const proxima = datas.find(d => d.split('T')[0] >= hoje) || datas[datas.length - 1];
            this.selecionarData(proxima);
          } else if (this.dataSelecionada) {
            this.loadRegistros();
          } else {
            this.membrosComPresenca = [];
          }
        }),
        catchError(() => {
          this.showMessage('Erro ao carregar datas!', true);
          return of([]);
        }),
        finalize(() => this.busy = false)
      )
      .subscribe();
  }

  loadMembros(): void {
    this.usuariosService.listarMacons(1, 1, '')
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(data => {
          this.membros = (data.items || data || [])
            .filter((m: any) => m.statusId === 1)
            .sort((a: any, b: any) => (a.nome || '').localeCompare(b.nome || ''));
        }),
        catchError(() => of([]))
      )
      .subscribe();
  }

  selecionarData(data: string): void {
    this.dataSelecionada = data;
    this.loadRegistros();
  }

  loadRegistros(): void {
    if (!this.dataSelecionada) return;
    this.busy = true;
    this.frequenciaService.listarPorData(this.dataSelecionada)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(registros => {
          this.registros = registros;
          this.montarLista();
        }),
        catchError(() => {
          this.showMessage('Erro ao carregar registros!', true);
          return of([]);
        }),
        finalize(() => this.busy = false)
      )
      .subscribe();
  }

  montarLista(): void {
    const tipoExistente = this.registros.length > 0 ? (this.registros[0].tipoSessao || 'Sessão Regular') : 'Sessão Regular';
    this.tipoSessaoSelecionado = tipoExistente;

    this.membrosComPresenca = this.membros.map(membro => {
      const registro = this.registros.find(r => r.usuarioModelsId === membro.id);
      return {
        membro,
        presente: registro ? registro.presente : false,
        registroId: registro ? registro.id : null,
        observacao: registro?.observacao || '',
        tipoSessao: registro?.tipoSessao || this.tipoSessaoSelecionado
      };
    });
    this.totalMembros = this.membrosComPresenca.length;
    this.totalPresentes = this.membrosComPresenca.filter(m => m.presente).length;
  }

  togglePresente(index: number): void {
    const item = this.membrosComPresenca[index];
    item.presente = !item.presente;
    if (item.presente && !item.observacao) {
      item.observacao = '';
    }
    if (!item.presente) {
      item.observacao = '';
    }
    this.totalPresentes = this.membrosComPresenca.filter(m => m.presente).length;
  }

  abrirVisita(index: number): void {
    this.visitaMembroIndex = index;
    this.visitaLoja = this.membrosComPresenca[index].observacao?.replace('Visita à ', '') || '';
    this.showVisitaModal = true;
  }

  confirmarVisita(): void {
    if (!this.visitaLoja.trim()) return;
    const item = this.membrosComPresenca[this.visitaMembroIndex];
    item.presente = true;
    item.observacao = `Visita à ${this.visitaLoja.trim()}`;
    this.showVisitaModal = false;
    this.visitaLoja = '';
    this.totalPresentes = this.membrosComPresenca.filter(m => m.presente).length;
  }

  cancelarVisita(): void {
    this.showVisitaModal = false;
    this.visitaLoja = '';
  }

  adicionarData(): void {
    if (!this.novaData) return;
    const dataFormatada = this.novaData + 'T19:30:00';
    if (!this.datasReuniao.includes(dataFormatada)) {
      this.datasReuniao.push(dataFormatada);
      this.datasReuniao.sort();
    }
    this.selecionarData(dataFormatada);
    this.novaData = '';
    this.showAddData = false;
  }

  removerData(data: string): void {
    this.datasReuniao = this.datasReuniao.filter(d => d !== data);
    if (this.dataSelecionada === data) {
      this.dataSelecionada = this.datasReuniao.length > 0 ? this.datasReuniao[0] : '';
      if (this.dataSelecionada) this.loadRegistros();
      else this.membrosComPresenca = [];
    }
  }

  salvar(): void {
    if (!this.dataSelecionada) {
      this.showMessage('Selecione uma data de reunião!', true);
      return;
    }
    this.saving = true;
    const lista: FrequenciaInterface[] = this.membrosComPresenca.map(item => ({
      id: item.registroId || 0,
      usuarioModelsId: item.membro.id,
      dataReuniao: this.dataSelecionada,
      presente: item.presente,
      observacao: item.observacao || null,
      tipoSessao: this.tipoSessaoSelecionado
    }));

    this.frequenciaService.salvarLista(lista)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(() => {
          this.showMessage('Frequência salva com sucesso!');
          this.loadRegistros();
        }),
        catchError(() => {
          this.showMessage('Erro ao salvar frequência!', true);
          return of(null);
        }),
        finalize(() => this.saving = false)
      )
      .subscribe();
  }

  formatarData(data: string): string {
    const d = new Date(data);
    return d.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
  }

  formatarDataShort(data: string): string {
    const d = new Date(data);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  }

  formatarDataInput(data: string): string {
    const d = new Date(data);
    return d.toISOString().split('T')[0];
  }

  getPercentual(): number {
    if (this.totalMembros === 0) return 0;
    return Math.round((this.totalPresentes / this.totalMembros) * 100);
  }

  isVisita(item: { observacao: string }): boolean {
    return item.observacao?.startsWith('Visita') || false;
  }

  abrirHistorico(): void {
    this.dialog.open(FrequenciaHistoricoComponent, {
      width: '900px',
      maxHeight: '90vh',
      panelClass: 'historico-dialog'
    });
  }

  showMessage(msg: string, isError = false): void {
    this.snackBar.open(msg, '✕', {
      duration: 4000, horizontalPosition: 'center', verticalPosition: 'top',
      panelClass: isError ? 'msg-error' : 'msg-success'
    });
  }
}

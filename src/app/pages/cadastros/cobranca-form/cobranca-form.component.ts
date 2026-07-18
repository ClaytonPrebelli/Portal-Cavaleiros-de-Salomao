import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CobrancasService } from 'src/app/core/services/cobrancas.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CobrancaInterface } from 'src/app/core/interfaces/login';
import { UsuariosInterface } from 'src/app/core/interfaces/login';
import { catchError, finalize, of, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { CapitalizePipe } from 'src/app/core/pipes/capitalize.pipe';
import { CurrencyMaskDirective } from 'src/app/core/directives/currency-mask.directive';

@Component({
  selector: 'app-cobranca-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule,
    MatSelectModule, MatCheckboxModule, MatDatepickerModule, MatNativeDateModule,
    MatProgressSpinnerModule, MatSnackBarModule, CapitalizePipe, CurrencyMaskDirective
  ],
  templateUrl: './cobranca-form.component.html',
  styleUrls: ['./cobranca-form.component.scss']
})
export class CobrancaFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cobrancasService = inject(CobrancasService);
  private usuariosService = inject(AuthService);
  private snackBar = inject(MatSnackBar);
  private destroyRef = inject(DestroyRef);

  busy = false;
  cobrancaForm: FormGroup;
  isEditing = false;
  categorias: any[] = [];
  membros: UsuariosInterface[] = [];

  mesesRef: string[] = [];
  mesAtual = '';

  constructor() {
    this.cobrancaForm = this.fb.group({
      id: [0],
      descricao: ['', Validators.required],
      ref: [''],
      categoriaCobrancaId: [null, Validators.required],
      usuarioModelsId: [null],
      valor: [0, [Validators.required, Validators.min(0.01)]],
      pago: [false],
      mesReferencia: [''],
      statusPagamento: ['Pendente'],
      vencimento: [new Date(), Validators.required],
      dataPagamento: [null]
    });

    this.buildMesesRef();
  }

  private buildMesesRef(): void {
    const now = new Date();
    this.mesAtual = `${now.getMonth() + 1}/${now.getFullYear()}`;
    for (let i = -5; i <= 6; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
      this.mesesRef.push(`${d.getMonth() + 1}/${d.getFullYear()}`);
    }
    this.cobrancaForm.patchValue({ mesReferencia: this.mesAtual });
  }

  ngOnInit(): void {
    this.loadCategorias();
    this.loadMembros();
    this.loadCobranca();
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

  loadMembros(): void {
    this.usuariosService.listarMacons(1, 1, '')
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(data => {
          this.membros = ((data as any).items || data || [])
            .sort((a: any, b: any) => (a.nome || '').localeCompare(b.nome || ''));
        }),
        catchError(() => of([]))
      )
      .subscribe();
  }

  private loadCobranca(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id || id === '0') {
      this.isEditing = false;
      return;
    }

    this.busy = true;
    this.isEditing = true;

    this.cobrancasService.verCobranca(parseInt(id))
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(cob => {
          this.cobrancaForm.patchValue({
            id: cob.id,
            descricao: cob.descricao,
            ref: cob.ref,
            categoriaCobrancaId: cob.categoriaCobrancaId,
            usuarioModelsId: cob.usuarioModelsId,
            valor: cob.valor,
            pago: cob.pago,
            mesReferencia: cob.mesReferencia || '',
            statusPagamento: cob.statusPagamento || 'Pendente',
            vencimento: new Date(cob.vencimento),
            dataPagamento: cob.dataPagamento ? new Date(cob.dataPagamento) : null
          });
        }),
        catchError(() => {
          this.showMessage('Cobrança não encontrada!', true);
          this.router.navigate(['/cadastros/cobrancas']);
          return of(null);
        }),
        finalize(() => this.busy = false)
      )
      .subscribe();
  }

  showMessage(msg: string, isError = false): void {
    this.snackBar.open(msg, '✕', {
      duration: 4000, horizontalPosition: 'center', verticalPosition: 'top',
      panelClass: isError ? 'msg-error' : 'msg-success'
    });
  }

  salvar(): void {
    if (this.cobrancaForm.invalid || this.busy) return;

    this.busy = true;
    const form = this.cobrancaForm.value;

    const cobranca: CobrancaInterface = {
      id: form.id,
      descricao: form.descricao,
      ref: '',
      categoriaCobrancaId: form.categoriaCobrancaId,
      usuarioModelsId: form.usuarioModelsId,
      valor: form.valor || 0,
      pago: form.pago,
      mesReferencia: form.mesReferencia,
      statusPagamento: form.statusPagamento,
      vencimento: form.vencimento,
      dataPagamento: form.dataPagamento
    };

    const request$ = this.isEditing
      ? this.cobrancasService.atualizar(cobranca)
      : this.cobrancasService.cadastrar(cobranca);

    request$
      .pipe(
        tap(() => {
          this.showMessage('Cobrança salva com sucesso!');
          this.router.navigate(['/cadastros/cobrancas']);
        }),
        catchError(() => {
          this.showMessage('Erro ao salvar cobrança!', true);
          return of(null);
        }),
        finalize(() => this.busy = false)
      )
      .subscribe();
  }
}

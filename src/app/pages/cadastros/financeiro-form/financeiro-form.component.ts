import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FinanceiroService } from 'src/app/core/services/financeiro.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { FinanceiroInterface, CategoriaFinanceiroInterface } from 'src/app/core/interfaces/financeiro';
import { UsuariosInterface } from 'src/app/core/interfaces/login';
import { catchError, finalize, of, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { CapitalizePipe } from 'src/app/core/pipes/capitalize.pipe';
import { CurrencyMaskDirective } from 'src/app/core/directives/currency-mask.directive';

@Component({
  selector: 'app-financeiro-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule,
    MatSelectModule, MatDatepickerModule, MatNativeDateModule,
    MatProgressSpinnerModule, MatSnackBarModule, MatCheckboxModule, CapitalizePipe, CurrencyMaskDirective
  ],
  templateUrl: './financeiro-form.component.html',
  styleUrls: ['./financeiro-form.component.scss']
})
export class FinanceiroFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private financeiroService = inject(FinanceiroService);
  private usuariosService = inject(AuthService);
  private snackBar = inject(MatSnackBar);
  private destroyRef = inject(DestroyRef);

  busy = false;
  form: FormGroup;
  isEditing = false;

  categorias: CategoriaFinanceiroInterface[] = [];
  membros: UsuariosInterface[] = [];

  constructor() {
    this.form = this.fb.group({
      id: [0],
      tipo: ['Entrada', Validators.required],
      categoriaFinanceiroId: [null, Validators.required],
      descricao: ['', Validators.required],
      valor: [0, [Validators.required, Validators.min(0.01)]],
      data: [new Date(), Validators.required],
      pago: [true],
      usuarioModelsId: [null],
      observacao: ['']
    });
  }

  ngOnInit(): void {
    this.loadCategorias();
    this.loadMembros();
    this.loadLancamento();
  }

  loadCategorias(): void {
    this.financeiroService.listarCategorias()
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
        tap(data => this.membros = ((data as any).items || data || [])
          .sort((a: any, b: any) => (a.nome || '').localeCompare(b.nome || ''))),
        catchError(() => of([]))
      )
      .subscribe();
  }

  get categoriasFiltradas(): CategoriaFinanceiroInterface[] {
    return this.categorias.filter(c => c.tipo === this.form.get('tipo')?.value);
  }

  private loadLancamento(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id || id === '0') {
      this.isEditing = false;
      return;
    }

    this.busy = true;
    this.isEditing = true;

    this.financeiroService.verLancamento(parseInt(id))
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(lanc => {
          this.form.patchValue({
            id: lanc.id,
            tipo: lanc.tipo,
            categoriaFinanceiroId: lanc.categoriaFinanceiroId,
            descricao: lanc.descricao,
            valor: lanc.valor,
            data: new Date(lanc.data),
            pago: lanc.pago,
            usuarioModelsId: lanc.usuarioModelsId,
            observacao: lanc.observacao
          });
        }),
        catchError(() => {
          this.showMessage('Lançamento não encontrado!', true);
          this.router.navigate(['/cadastros/financeiro']);
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
    if (this.form.invalid || this.busy) return;

    this.busy = true;
    const val = this.form.value;

    const lancamento: FinanceiroInterface = {
      id: val.id,
      tipo: val.tipo,
      categoriaFinanceiroId: val.categoriaFinanceiroId,
      descricao: val.descricao,
      valor: val.valor || 0,
      data: val.data,
      pago: val.pago,
      dataPagamento: val.pago ? new Date() : null,
      usuarioModelsId: val.usuarioModelsId,
      observacao: val.observacao
    };

    const request$ = this.isEditing
      ? this.financeiroService.atualizar(lancamento)
      : this.financeiroService.cadastrar(lancamento);

    request$
      .pipe(
        tap(() => {
          this.showMessage('Lançamento salvo com sucesso!');
          this.router.navigate(['/cadastros/financeiro']);
        }),
        catchError(() => {
          this.showMessage('Erro ao salvar!', true);
          return of(null);
        }),
        finalize(() => this.busy = false)
      )
      .subscribe();
  }
}

import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ComunicadosService } from 'src/app/core/services/comunicados.service';
import { ComunicadoInterface } from 'src/app/core/interfaces/comunicados';
import { catchError, finalize, of, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-comunicado-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './comunicado-form.component.html',
  styleUrls: ['./comunicado-form.component.scss']
})
export class ComunicadoFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private comunicadosService = inject(ComunicadosService);
  private snackBar = inject(MatSnackBar);
  private destroyRef = inject(DestroyRef);

  busy = false;
  comunicadoForm: FormGroup;
  isEditing = false;

  grausDisponiveis = [
    { label: 'Aprendiz', value: 'Aprendiz' },
    { label: 'Companheiro', value: 'Companheiro' },
    { label: 'Mestre', value: 'Mestre' }
  ];
  grausSelecionados: string[] = [];

  constructor() {
    this.comunicadoForm = this.fb.group({
      id: [0],
      titulo: ['', [Validators.required, Validators.minLength(5)]],
      texto: ['', [Validators.required, Validators.minLength(20)]],
      dataPublicacao: [new Date(), Validators.required],
      autorId: [null as number | null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadComunicado();
  }

  private loadCurrentUser(): void {
    const userStr = localStorage.getItem('MasonUser');
    if (userStr) {
      const user = JSON.parse(userStr);
      this.comunicadoForm.patchValue({ autorId: user.id });
    }
  }

  private loadComunicado(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id || id === '0') {
      this.isEditing = false;
      return;
    }

    this.busy = true;
    this.isEditing = true;

    this.comunicadosService.verComunicado(parseInt(id))
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(comunicado => {
          this.comunicadoForm.patchValue({
            id: comunicado.id,
            titulo: comunicado.titulo,
            texto: comunicado.texto?.replace(/<\/?p>/g, '\n').trim() || '',
            dataPublicacao: new Date(comunicado.dataPublicacao),
            autorId: comunicado.autorId
          });
          if (comunicado.graus) {
            this.grausSelecionados = comunicado.graus.split(',').map(g => g.trim());
          }
        }),
        catchError(() => {
          this.showMessage('Comunicado não encontrado!', true);
          this.router.navigate(['/cadastros/comunicados']);
          return of(null);
        }),
        finalize(() => this.busy = false)
      )
      .subscribe();
  }

  toggleGrau(grau: string): void {
    const idx = this.grausSelecionados.indexOf(grau);
    if (idx >= 0) {
      this.grausSelecionados.splice(idx, 1);
    } else {
      this.grausSelecionados.push(grau);
    }
  }

  isGrauSelected(grau: string): boolean {
    return this.grausSelecionados.includes(grau);
  }

  showMessage(msg: string, isError: boolean = false): void {
    this.snackBar.open(msg, '✕', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: isError ? 'msg-error' : 'msg-success'
    });
  }

  salvar(): void {
    if (this.comunicadoForm.invalid || this.busy || this.grausSelecionados.length === 0) {
      if (this.grausSelecionados.length === 0) {
        this.showMessage('Selecione ao menos um grau!', true);
      }
      return;
    }

    this.busy = true;
    const formValue = this.comunicadoForm.value;

    const textoFormatado = formValue.texto
      .split('\n')
      .filter((line: string) => line.trim())
      .map((line: string) => `<p>${line.trim()}</p>`)
      .join('');

    const comunicado: ComunicadoInterface = {
      id: formValue.id,
      titulo: formValue.titulo,
      texto: textoFormatado,
      graus: this.grausSelecionados.join(','),
      dataPublicacao: formValue.dataPublicacao,
      autorId: formValue.autorId
    };

    const request$ = this.isEditing
      ? this.comunicadosService.atualizarComunicado(comunicado)
      : this.comunicadosService.gravarComunicado(comunicado);

    request$
      .pipe(
        tap(() => {
          this.showMessage('Comunicado salvo com sucesso!');
          this.router.navigate(['/cadastros/comunicados']);
        }),
        catchError(() => {
          this.showMessage('Erro ao salvar comunicado!', true);
          return of(null);
        }),
        finalize(() => this.busy = false)
      )
      .subscribe();
  }
}

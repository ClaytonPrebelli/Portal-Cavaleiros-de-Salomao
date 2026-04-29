import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, catchError, finalize, of, tap } from 'rxjs';
import { CandidatoInterface } from 'src/app/core/interfaces/candidato';
import { AuthService } from 'src/app/core/services/auth.service';
import { ModalFamiliarComponent } from '../../shared/modal-familiar/modal-familiar.component';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { DatePipe, DecimalPipe } from '@angular/common';
import { AcreditaPipe } from 'src/app/core/pipes/acredita.pipe';
import { QtdNumerosPipe } from 'src/app/core/pipes/qtd-numeros.pipe';

@Component({
  selector: 'app-candidatos',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
    NgxMaskDirective
  ],
  providers: [provideNgxMask()],
  templateUrl: './candidatos.component.html',
  styleUrls: ['./candidatos.component.scss']
})
export class CandidatosComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private service = inject(AuthService);
  private modal = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  busy = false;
  candidatoEnviar!: CandidatoInterface;
  token = '';
  candidatoId = 0;
  
  listaEstados = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'];
  
  candidatoForm: FormGroup = this.fb.group({
    id: [0, Validators.required],
    nome: ['', [Validators.required, Validators.minLength(3)]],
    cpf: ['', Validators.required],
    rg: ['', Validators.required],
    dataExpedicao: ['', Validators.required],
    nascimento: ['', Validators.required],
    religiao: ['', Validators.required],
    acreditaSerSupremo: ['', Validators.required],
    naturalidade: ['', Validators.required],
    estado: ['', Validators.required],
    nacionalidade: ['', Validators.required],
    estadoCivil: ['', Validators.required],
    tipoSanguineo: [''],
    profissao: ['', Validators.required],
    endereco: ['', Validators.required],
    numero: ['', Validators.required],
    cep: ['', Validators.required],
    cidade: ['', Validators.required],
    bairro: ['', Validators.required],
    tempoMoradia: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    fone: ['', Validators.required],
    renda: ['', Validators.required],
    pai: ['', Validators.required],
    mae: ['', Validators.required],
    paiMacom: [false],
    dataCadastro: [new Date(), Validators.required],
    vicios: ['', Validators.required],
    aptidoes: ['', Validators.required],
    foneEmergencia: ['', Validators.required],
    contatoEmergencia: ['', Validators.required],
    familiaConcorda: ['', Validators.required],
    statusId: [3, Validators.required],
    quemIndica: [1, Validators.required],
    motivos: ['', Validators.required]
  });

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token') ?? '';
    this.validaToken();
  }

  private validaToken(): void {
    this.service.validaToken(this.token).pipe(
      tap(() => {
        // Token válido
      }),
      catchError(() => {
        this.showMessage('Token de acesso já utilizado ou expirado.', true);
        setTimeout(() => {
          window.location.href = 'https://glumbsp.com.br';
        }, 7000);
        return of(null);
      })
    ).subscribe();
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
    if (this.candidatoForm.invalid || this.busy) return;

    this.busy = true;
    const formValue = this.candidatoForm.value;
    
    this.candidatoEnviar = {
      ...formValue,
      cpf: formValue.cpf.replace(/[^\d]/g, ''),
      rg: formValue.rg.replace(/[^\d]/g, '')
    };

    this.service.cadastrarCandidato(this.candidatoEnviar, this.token)
      .pipe(
        tap(data => {
          this.candidatoId = data.id;
          const dialogRef = this.modal.open(ModalFamiliarComponent, {
            data: { id: this.candidatoId, candidato: true },
            width: '90vw',
            height: '90vh'
          });

          dialogRef.afterClosed().subscribe(() => {
            this.showMessage('Sua ficha foi enviada. Iremos analisar e retornar o contato.', false);
            setTimeout(() => {
              window.location.href = 'https://glumbsp.com.br';
            }, 7000);
          });
        }),
        catchError(error => {
          console.log(error);
          this.busy = false;
          return of(null);
        })
      )
      .subscribe();
  }
}

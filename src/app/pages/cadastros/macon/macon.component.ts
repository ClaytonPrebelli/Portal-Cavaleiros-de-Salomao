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
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { Router, RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Observable, catchError, finalize, of, switchMap, tap } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { LojasService } from 'src/app/core/services/lojas.service';
import { UsuariosInterface } from 'src/app/core/interfaces/login';
import { StatusInterface } from 'src/app/core/interfaces/status';
import { LojasInterface } from 'src/app/core/interfaces/lojas';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ModalFamiliarComponent } from '../../shared/modal-familiar/modal-familiar.component';

@Component({
  selector: 'app-macom',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
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
    MatTooltipModule,
    MatDividerModule,
    MatTabsModule,
    MatDialogModule,
    NgxMaskDirective
  ],
  providers: [provideNgxMask()],
  templateUrl: './macon.component.html',
  styleUrls: ['./macon.component.scss']
})
export class MaconComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private usuarioService = inject(AuthService);
  private lojasService = inject(LojasService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  busy = false;
  isEditing = false;
  fotoPreview: string | ArrayBuffer | null = null;
  selectedFile?: File;  
  listaEstados = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'];
  listaFormas = ['Iniciação','Afiliação','Transferência'];
  listaStatus: StatusInterface[] = [];
  listaLojas: LojasInterface[] = [];
  macom?: UsuariosInterface;
  grauSimb = '';
  idade = 0;
  familiaresTemp: any[] = [];

  macomForm: FormGroup = this.fb.group({
    id: [0],
    nome: ['', [Validators.required, Validators.minLength(3)]],
    cim: [''],
    cpf: ['', [Validators.required]],
    rg: ['', [Validators.required]],
    nascimento: ['', Validators.required],
    naturalidade: [''],
    estado: ['', Validators.required],
    nacionalidade: ['', Validators.required],
    estadoCivil: ['', Validators.required],
    tipoSanguineo: [''],
    cep: ['', Validators.required],
    profissao: ['', Validators.required],
    endereco: ['', Validators.required],
    numero: ['', Validators.required],
    cidade: ['', Validators.required],
    bairro: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    fone: ['', Validators.required],
    pai: ['', Validators.required],
    mae: ['', Validators.required],
    iniciacao: [null],
    elevacao: [null],
    exaltacao: [null],
    observacoes: [''],
    contatoEmergencia: ['', Validators.required],
    foneEmergencia: ['', Validators.required],
    isCandidato: [false],
    isAprendiz: [true],
    isCompanheiro: [false],
    isMestre: [false],
    isAdmin: [false],
    isSuperAdmin: [false],
    pass: ['', Validators.required],
    dataAfiliacao: [''],
    formaAfiliacao: [''],
    cargo: [''],
    titulo: [''],
    statusId: [1, Validators.required],
    lojaId: [0, Validators.required]
  });

  ngOnInit(): void {
    this.loadInitialData();
    this.checkEditMode();
  }

  private loadInitialData(): void {
    this.usuarioService.listarStatus()
      .pipe(
        tap(data => this.listaStatus = data),
        catchError(() => of([]))
      )
      .subscribe();

    this.lojasService.verLojasAtivas()
      .pipe(
        tap(data => this.listaLojas = data),
        catchError(() => of([]))
      )
      .subscribe();
  }

  private checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== '0') {
      this.isEditing = true;
      this.loadMacom(parseInt(id));
    }
  }

  private loadMacom(id: number): void {
    this.busy = true;
    this.usuarioService.verMacom(id)
      .pipe(
        tap(data => {
          this.macom = data;
          this.grauSimb = this.validaGrauSimb(this.macom);
          this.idade = this.getAge(this.macom.nascimento.toString());
          this.preencheForm(data);
          // Carrega foto existente se houver
          if (data.foto && data.foto.length > 0 && data.foto[0].fotoFile) {
            this.fotoPreview = `data:image/png;base64,${data.foto[0].fotoFile}`;
          } else {
            this.fotoPreview = `https://prebellisolucoes.com/FotosUsers/${data.id}.png`;
          }
        }),
        finalize(() => this.busy = false)
      )
      .subscribe();
  }

  private preencheForm(data: UsuariosInterface): void {
    this.familiaresTemp = [];
    this.macomForm.patchValue({
      id: data.id,
      nome: data.nome,
      cim: data.cim,
      cpf: data.cpf,
      rg: data.rg,
      nascimento: this.parseLocalDate(data.nascimento),
      naturalidade: data.naturalidade,
      estado: data.estado,
      nacionalidade: data.nacionalidade,
      estadoCivil: data.estadoCivil,
      tipoSanguineo: data.tipoSanguineo,
      cep: data.cep,
      profissao: data.profissao,
      endereco: data.endereco,
      numero: data.numero,
      cidade: data.cidade,
      bairro: data.bairro,
      email: data.email,
      fone: data.fone,
      pai: data.pai,
      mae: data.mae,
      iniciacao: this.parseLocalDate(data.iniciacao),
      elevacao: this.parseLocalDate(data.elevacao),
      exaltacao: this.parseLocalDate(data.exaltacao),
      observacoes: data.observacoes,
      contatoEmergencia: data.contatoEmergencia,
      foneEmergencia: data.foneEmergencia,
      isCandidato: data.isCandidato,
      isAprendiz: data.isAprendiz,
      isCompanheiro: data.isCompanheiro,
      isMestre: data.isMestre,
      isAdmin: data.isAdmin,
      isSuperAdmin: data.isSuperAdmin,
      pass: data.pass,
      dataAfiliacao: this.parseLocalDate(data.dataAfiliacao),
      formaAfiliacao: data.formaAfiliacao,
      cargo: data.cargo,
      titulo: data.titulo,
      statusId: data.statusId,
      lojaId: data.lojaId
    });

    if (data.foto && data.foto.length > 0 && data.foto[0].fotoFile) {
      this.fotoPreview = `data:image/png;base64,${data.foto[0].fotoFile}`;
    }
  }

  private parseLocalDate(date: any): Date | null {
    if (!date) return null;
    
    const dateStr = String(date);
    const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      const year = parseInt(match[1]);
      const month = parseInt(match[2]) - 1; // Month is 0-indexed
      const day = parseInt(match[3]);
      return new Date(year, month, day);
    }
    
    return null;
  }

  private formatDate(date: any): string | null {
    if (!date) return null;
    
    // Converte para string e extrai o padrão YYYY-MM-DD diretamente
    const dateStr = String(date);
    const match = dateStr.match(/(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      return `${match[1]}-${match[2]}-${match[3]}`;
    }
    
    return null;
  }

  get hide(): boolean {
    return this._hide;
  }

  set hide(value: boolean) {
    this._hide = value;
  }

  private _hide = true;

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      
      const reader = new FileReader();
      reader.onload = (e) => {
        this.fotoPreview = e.target?.result || null;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  escolheFoto(): void {
    document.getElementById('input-file')?.click();
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
    if (this.macomForm.invalid || this.busy) return;

    this.busy = true;
    const formValue = this.macomForm.value;
    
    const userEnviar: any = {
      ...formValue,
      cpf: formValue.cpf.replace(/[^\d]/g, ''),
      rg: formValue.rg.replace(/[^\d]/g, ''),
      cim: formValue.cim ? parseInt(formValue.cim) : 0,
      familiares: this.familiaresTemp.length > 0 ? this.familiaresTemp : (this.macom?.familiares || [])
    };


    this.usuarioService.cadastrarMacom(userEnviar)
      .pipe(
        switchMap(savedMacom => {
          if (this.selectedFile) {
            return this.usuarioService.gravarFotoIUser(this.selectedFile, savedMacom.id!);
          }
          return of(null);
        }),
        tap(() => {
          this.showMessage('Maçom salvo com sucesso!', false);
          this.router.navigate(['/cadastros/macoms']);
        }),
        catchError(error => {
          this.showMessage('Erro ao salvar maçom. Tente novamente.', true);
          return of(null);
        }),
        finalize(() => this.busy = false)
      )
      .subscribe();
  }

  limpar(): void {
    this.macomForm.reset();
    this.fotoPreview = null;
    this.selectedFile = undefined;
    this.familiaresTemp = [];
  }

  // Gerenciamento de Familiares
  adicionarFamiliar(): void {
    const dialogRef = this.dialog.open(ModalFamiliarComponent, {
      data: { id: this.macomForm.get('id')?.value || 0, candidato: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.familiaresTemp.push(result);
        this.showMessage('Familiar adicionado!', false);
      }
    });
  }

  editarFamiliar(familiar: any): void {
    const dialogRef = this.dialog.open(ModalFamiliarComponent, {
      data: { 
        id: this.macomForm.get('id')?.value || 0, 
        candidato: false,
        familiar: familiar
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.familiaresTemp.findIndex(f => f.id === result.id);
        if (index > -1) {
          this.familiaresTemp[index] = result;
        }
        this.showMessage('Familiar atualizado!', false);
      }
    });
  }

  removerFamiliar(familiar: any): void {
    this.familiaresTemp = this.familiaresTemp.filter(f => f !== familiar);
    this.showMessage('Familiar removido!', false);
  }

  get familiaresParaExibir(): any[] {
    // Se estiver editando e já tem macom carregado, mesclar com temporários
    if (this.macom?.familiares) {
      const idsTemp = this.familiaresTemp.map(f => f.id);
      const originais = this.macom.familiares.filter(f => !idsTemp.includes(f.id));
      return [...originais, ...this.familiaresTemp];
    }
    return this.familiaresTemp;
  }

  getAge(dateString: string): number {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  validaGrauSimb(macom: UsuariosInterface): string {
    if (macom.isMestre) return 'Mestre Maçom';
    if (macom.isCompanheiro) return 'Companheiro de Ofício';
    if (macom.isAprendiz) return 'Aprendiz Maçom';
    return 'Candidato';
  }
}

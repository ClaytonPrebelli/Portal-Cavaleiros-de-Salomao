import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router, RouterLink } from '@angular/router';
import { catchError, finalize, of, tap } from 'rxjs';
import { FamiliaresInterface, LoginResponse, UsuariosInterface, CobrancaInterface } from 'src/app/core/interfaces/login';
import { AuthService } from 'src/app/core/services/auth.service';
import { CobrancasService } from 'src/app/core/services/cobrancas.service';
import { Envs } from 'src/app/core/services/envs';
import { PdfGeneratorService } from 'src/app/core/services/pdf-generator.service';
import { ModalTokenComponent } from 'src/app/pages/shared/modal-token/modal-token.component';
import { QtdNumerosPipe } from 'src/app/core/pipes/qtd-numeros.pipe';

@Component({
  selector: 'app-home-painel',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatChipsModule,
    MatTooltipModule,
    MatDialogModule,
    QtdNumerosPipe
  ],
  templateUrl: './home-painel.component.html',
  styleUrls: ['./home-painel.component.scss']
})
export class HomePainelComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  private userService = inject(AuthService);
  private cobrancasService = inject(CobrancasService);
  private pdfGenerator = inject(PdfGeneratorService);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  busy = false;
  fotosUrl = Envs.fotosUrl;
  currentUser!: LoginResponse;
  nomeLoja = 'Cavaleiros de Salomão';
  macom: UsuariosInterface = {
    bairro: '', cargo: null, cep: '', cidade: '', cim: 0,
    contatoEmergencia: '', cpf: '', dataAfiliacao: new Date(), 
    email: '', endereco: '', estado: '', estadoCivil: '', exaltacao: new Date(),elevacao: new Date(),
    fone: '', foneEmergencia: '', formaAfiliacao: '', id: 0,
    iniciacao: new Date(), isAdmin: false, isAprendiz: false, isCandidato: false,
    isCompanheiro: false, isMestre: false, isSuperAdmin: false,
    isMestreInstalado: false, dataInstalacao: null,
    mae: '', nacionalidade: '', naturalidade: '', nascimento: new Date(),
    nome: '', numero: '', observacoes: '', pai: '', pass: '', profissao: '', rg: '', statusId: 0, tipoSanguineo: '', cargoId: null,
    familiares: []
  };
  
  idade = 0;
  grauSimb = '';
  hoje = '';
  validade = '';
  cobrancas: CobrancaInterface[] = [];

  ngOnInit(): void {
    const hojeTemp = new Date();
    this.hoje = (hojeTemp.getMonth() + 1).toString() + '/' + hojeTemp.getFullYear().toString();
    this.validade = (hojeTemp.getMonth() + 1).toString() + '/' + (hojeTemp.getFullYear() + 1).toString();
    this.busy = true;
    
    const local: any = localStorage.getItem('MasonUser');
    if (local) {
      this.currentUser = JSON.parse(local);
      this.userService.verMacom(this.currentUser.id)
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          tap(macom => {
            this.macom = macom;
            this.grauSimb = this.validaGrauSimb(macom);
            this.idade = this.getAge(macom.nascimento.toString());
          }),
          catchError(() => of(null)),
          finalize(() => this.busy = false)
        )
        .subscribe();

      this.cobrancasService.listarPorMembro(this.currentUser.id)
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          tap(data => {
            this.cobrancas = data;
          }),
          catchError(() => of([]))
        )
        .subscribe();
    }
  }

  pad(numero: number | null): string {
    return numero?.toString().padStart(6, '0') ?? '';
  }

  grau(macom: UsuariosInterface): string {
    if (macom.isMestre && macom.isMestreInstalado) return 'Mestre Instalado';
    if (macom.isMestre) return 'Mestre Maçom';
    if (macom.isCompanheiro) return 'Companheiro de Ofício';
    return 'Aprendiz Admitido';
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
    if (macom.isMestre && macom.isMestreInstalado) return 'Mestre Instalado';
    if (macom.isMestre) return 'Mestre Maçom';
    if (macom.isCompanheiro) return 'Companheiro de Ofício';
    if (macom.isAprendiz) return 'Aprendiz Maçom';
    return 'Candidato';
  }

  async openPDF(): Promise<void> {
    await this.pdfGenerator.generateCarteirinha(
      this.macom,
      this.idade,
      this.grau(this.macom),
      this.hoje,
      this.validade
    );
  }

  gerarToken(): void {
    this.userService.gerarToken(this.currentUser.id).pipe(
      takeUntilDestroyed(this.destroyRef),
      tap(data => {
        const token = 'https://restrito.gosp.com.br/cadastro/candidato/' + data;
        this.abrirModal(token);
      }),
      catchError(error => {
        const token = error?.error?.text || 'Erro ao gerar token';
        this.abrirModal(token);
        return of(null);
      })
    ).subscribe();
  }

  abrirModal(token: string): void {
    this.dialog.open(ModalTokenComponent, {
      data: { link: token }
    });
  }

  logout(): void {
    localStorage.removeItem('MasonUser');
    this.router.navigate(['/']);
  }

  capitalize(texto: string): string {
    return texto.toLowerCase().replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
  }

  abrirModalFamiliar(): void {
  }

  editarFamiliares(): void {
  }

  handleImgError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
    const fallback = img.parentElement?.querySelector('.card-photo-fallback') as HTMLElement;
    if (fallback) {
      fallback.style.display = 'flex';
    }
  }
}

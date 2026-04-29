import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';
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
import { Observable, catchError, finalize, of, tap } from 'rxjs';
import { dash } from 'pdfkit';
import { FotoInterface } from 'src/app/core/interfaces/foto';
import { FamiliaresInterface, LoginResponse, UsuariosInterface } from 'src/app/core/interfaces/login';
import { AuthService } from 'src/app/core/services/auth.service';
import { LojasService } from 'src/app/core/services/lojas.service';
import { ModalTokenComponent } from 'src/app/pages/shared/modal-token/modal-token.component';
import { QtdNumerosPipe } from 'src/app/core/pipes/qtd-numeros.pipe';

@Component({
  selector: 'app-home-painel',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
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
  private userService = inject(AuthService);
  private lojaService = inject(LojasService);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  busy = false;
  currentUser!: LoginResponse;
  fotoLoja: FotoInterface = { fotoFile: [], fotoName: '', id: 0 };
  nomeLoja = '';
  macom: UsuariosInterface = {
    bairro: '', cargo: '', cep: '', cidade: '', cim: 0,
    contatoEmergencia: '', cpf: '', dataAfiliacao: new Date(), 
    email: '', endereco: '', estado: '', estadoCivil: '', exaltacao: new Date(),elevacao: new Date(),
    fone: '', foneEmergencia: '', formaAfiliacao: '', id: 0,
    iniciacao: new Date(), isAdmin: false, isAprendiz: false, isCandidato: false,
    isCompanheiro: false, isMestre: false, isSuperAdmin: false,
    lojaId: 0, mae: '', nacionalidade: '', naturalidade: '', nascimento: new Date(),
    nome: '', numero: '', observacoes: '', pai: '', pass: '', profissao: '', rg: '', statusId: 0, tipoSanguineo: '', titulo: '',
    loja: { ativa: true,rito:'', dataFundacao: new Date(), documentos: [], endereco: '',
      estado: '', id: 0, instagram: '', nomeLoja: '', numeroLoja: 0,
      oriente: '', veneravel: 0 },
    familiares: []
  };
  
  idade = 0;
  grauSimb = '';
  hoje = '';
  validade = '';

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
          tap(macom => {
            this.macom = macom;
            this.grauSimb = this.validaGrauSimb(macom);
            this.idade = this.getAge(macom.nascimento.toString());
            if (macom.loja) {
              this.nomeLoja = macom.loja.nomeLoja;
            }
          }),
          catchError(() => of(null)),
          finalize(() => this.busy = false)
        )
        .subscribe();
    }
  }

  pad(numero: number | null): string {
    return numero?.toString().padStart(6, '0') ?? '';
  }

  grau(macom: UsuariosInterface): string {
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
    if (macom.isMestre) return 'Mestre Maçom';
    if (macom.isCompanheiro) return 'Companheiro de Ofício';
    if (macom.isAprendiz) return 'Aprendiz Maçom';
    return 'Candidato';
  }

  openPDF(): void {
    this.userService.gerarCarteirinha(this.macom.id).pipe(
      tap(data => {
        const linkSource = 'data:application/pdf;base64,' + data;
        const downloadLink = document.createElement('a');
        const fileName = `CIM ${this.macom.nome}.pdf`;
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
      }),
      catchError(() => of(null))
    ).subscribe();
  }

  gerarToken(): void {
    this.userService.gerarToken(this.currentUser.id).pipe(
      tap(data => {
        const token = 'https://restrito.glumbsp.com.br/cadastro/candidato/' + data;
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
    // TODO: implementar modal de familiar
  }

  editarFamiliares(): void {
    // TODO: implementar edição de familiares
  }
}

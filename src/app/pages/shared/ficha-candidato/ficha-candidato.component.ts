import { Component, OnInit, inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { CandidatoInterface } from 'src/app/core/interfaces/candidato';
import { AuthService } from 'src/app/core/services/auth.service';
import { AcreditaPipe } from 'src/app/core/pipes/acredita.pipe';
import { QtdNumerosPipe } from 'src/app/core/pipes/qtd-numeros.pipe';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { Observable, catchError, finalize, of, tap } from 'rxjs';

@Component({
  selector: 'app-ficha-candidato',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    DatePipe,
    AcreditaPipe,
    QtdNumerosPipe,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCardModule
  ],
  templateUrl: './ficha-candidato.component.html',
  styleUrls: ['./ficha-candidato.component.scss']
})
export class FichaCandidatoComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private usuarioService = inject(AuthService);

  busy = false;
  candidato: CandidatoInterface = {
    id: 0,
    nome: '',
    cpf: '',
    rg: '',
    dataExpedicao: new Date(),
    nascimento: new Date(),
    religiao: '',
    acreditaSerSupremo: true,
    naturalidade: '',
    estado: '',
    nacionalidade: '',
    estadoCivil: '',
    tipoSanguineo: '',
    cep: '',
    profissao: '',
    endereco: '',
    tempoMoradia: '',
    numero: '',
    cidade: '',
    bairro: '',
    email: '',
    fone: '',
    renda: 0,
    pai: '',
    mae: '',
    paiMacom: false,
    dataCadastro: new Date(),
    vicios: '',
    aptidoes: '',
    foneEmergencia: '',
    contatoEmergencia: '',
    familiaConcorda: true,
    statusId: 0,
    quemIndica: 1,
    motivos: '',
    familiares: []
  };
  
  idade = 0;
  
  @ViewChild('htmlData', { static: false }) htmlData!: ElementRef;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '0';
    this.loadCandidato(parseInt(id));
  }

  private loadCandidato(id: number): void {
    this.busy = true;
    this.usuarioService.verCandidato(id)
      .pipe(
        tap(data => {
          this.candidato = data;
          this.idade = this.getAge(this.candidato.nascimento.toString());
        }),
        catchError(() => {
          return of(null);
        }),
        finalize(() => this.busy = false)
      )
      .subscribe();
  }

  capitalize(texto: string): string {
    return texto.toLowerCase().replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
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

  openPDF(): void {
    this.usuarioService.baixarFichaCandidato(this.candidato.id, this.idade)
      .pipe(
        tap(data => {
          const linkSource = 'data:application/pdf;base64,' + data;
          const downloadLink = document.createElement('a');
          const fileName = `Ficha Candidato ${this.candidato.nome}.pdf`;
          
          downloadLink.href = linkSource;
          downloadLink.download = fileName;
          downloadLink.click();
        }),
        catchError(() => {
          return of(null);
        })
      )
      .subscribe();
  }

  base64ToArrayBuffer(base64: any): ArrayBuffer {
    const binary_string = window.atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }
}

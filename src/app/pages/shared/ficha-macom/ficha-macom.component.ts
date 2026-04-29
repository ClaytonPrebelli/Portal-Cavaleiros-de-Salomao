import { Component, OnInit, inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { DecimalPipe } from '@angular/common';
import { UsuariosInterface } from 'src/app/core/interfaces/login';
import { LojasInterface } from 'src/app/core/interfaces/lojas';
import { AuthService } from 'src/app/core/services/auth.service';
import { LojasService } from 'src/app/core/services/lojas.service';
import { AcreditaPipe } from 'src/app/core/pipes/acredita.pipe';
import { QtdNumerosPipe } from 'src/app/core/pipes/qtd-numeros.pipe';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { Observable, catchError, finalize, of, tap } from 'rxjs';

@Component({
  selector: 'app-ficha-macom',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    DatePipe,
    DecimalPipe,
    AcreditaPipe,
    QtdNumerosPipe,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCardModule
  ],
  templateUrl: './ficha-macom.component.html',
  styleUrls: ['./ficha-macom.component.scss']
})
export class FichaMacomComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private usuarioService = inject(AuthService);
  private lojasService = inject(LojasService);

  busy = false;
  macom!: UsuariosInterface;
  idade = 0;
  grauSimb = '';
  
  @ViewChild('htmlData', { static: false }) htmlData!: ElementRef;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '0';
    this.loadMacom(parseInt(id));
  }

  private loadMacom(id: number): void {
    this.busy = true;
    this.usuarioService.verMacom(id)
      .pipe(
        tap(data => {
          this.macom = data;
          this.grauSimb = this.validaGrauSimb(this.macom);
          this.idade = this.getAge(this.macom.nascimento.toString());
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

  pad(numero: number | null): string {
    return numero?.toString().padStart(6, '0') ?? '';
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
    this.usuarioService.baixarFichaMacom(this.macom.id, this.idade)
      .pipe(
        tap(data => {
          const linkSource = 'data:application/pdf;base64,' + data;
          const downloadLink = document.createElement('a');
          const fileName = `Ficha - ${this.macom.nome}.pdf`;
          
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

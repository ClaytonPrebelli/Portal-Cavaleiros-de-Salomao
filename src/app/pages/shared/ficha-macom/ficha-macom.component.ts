import { Component, OnInit, inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UsuariosInterface } from 'src/app/core/interfaces/login';
import { AuthService } from 'src/app/core/services/auth.service';
import { AcreditaPipe } from 'src/app/core/pipes/acredita.pipe';
import { QtdNumerosPipe } from 'src/app/core/pipes/qtd-numeros.pipe';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { catchError, finalize, of, tap } from 'rxjs';

@Component({
  selector: 'app-ficha-macom',
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
    MatCardModule,
    MatChipsModule
  ],
  templateUrl: './ficha-macom.component.html',
  styleUrls: ['./ficha-macom.component.scss']
})
export class FichaMacomComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private usuarioService = inject(AuthService);

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
          this.grauSimb = this.validaGrauSimb(data);
          this.idade = this.getAge(data.nascimento.toString());
        }),
        catchError(() => of(null)),
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

  getGrauClass(): string {
    if (this.macom.isMestre) return 'grau-mestre';
    if (this.macom.isCompanheiro) return 'grau-companheiro';
    if (this.macom.isAprendiz) return 'grau-aprendiz';
    return 'grau-candidato';
  }

  getStatusClass(): string {
    const status = this.macom.status?.status.toLowerCase() ?? '';
    if (status.includes('ativo')) return 'status-ativo';
    if (status.includes('inativo')) return 'status-inativo';
    if (status.includes('afastado')) return 'status-afastado';
    return '';
  }

  handleImgError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
  }

  openPDF(): void {
    this.usuarioService.baixarFichaMacom(this.macom.id, this.idade)
      .pipe(
        tap(data => {
          const linkSource = 'data:application/pdf;base64,' + data;
          const downloadLink = document.createElement('a');
          downloadLink.href = linkSource;
          downloadLink.download = `Ficha - ${this.macom.nome}.pdf`;
          downloadLink.click();
        }),
        catchError(() => of(null))
      )
      .subscribe();
  }
}

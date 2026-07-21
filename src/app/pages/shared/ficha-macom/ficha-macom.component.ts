import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UsuariosInterface } from 'src/app/core/interfaces/login';
import { AuthService } from 'src/app/core/services/auth.service';
import { FrequenciaService } from 'src/app/core/services/frequencia.service';
import { Envs } from 'src/app/core/services/envs';
import { PdfGeneratorService } from 'src/app/core/services/pdf-generator.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { catchError, finalize, forkJoin, of, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-ficha-macom',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    DatePipe,
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
  private frequenciaService = inject(FrequenciaService);
  private pdfGenerator = inject(PdfGeneratorService);
  private destroyRef = inject(DestroyRef);

  busy = false;
  fotosUrl = Envs.fotosUrl;
  macom!: UsuariosInterface;
  idade = 0;
  grauSimb = '';
  frequenciaTotal = 0;
  frequenciaPresentes = 0;
  frequenciaPercentual = 0;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '0';
    this.loadMacom(parseInt(id));
  }

  private loadMacom(id: number): void {
    this.busy = true;
    forkJoin({
      macom: this.usuarioService.verMacom(id),
      frequencia: this.frequenciaService.listarPorMembro(id)
    })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(({ macom, frequencia }) => {
          this.macom = macom;
          this.grauSimb = this.validaGrauSimb(macom);
          this.idade = this.getAge(macom.nascimento.toString());
          this.frequenciaTotal = frequencia.length;
          this.frequenciaPresentes = frequencia.filter(f => f.presente).length;
          this.frequenciaPercentual = this.frequenciaTotal > 0
            ? Math.round((this.frequenciaPresentes / this.frequenciaTotal) * 100)
            : 0;
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
    if (macom.isMestre && macom.isMestreInstalado) return 'Mestre Instalado';
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

  async openPDF(): Promise<void> {
    await this.pdfGenerator.generateFichaMacom(this.macom, this.idade);
  }
}

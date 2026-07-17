import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CandidatoInterface } from 'src/app/core/interfaces/candidato';
import { AuthService } from 'src/app/core/services/auth.service';
import { PdfGeneratorService } from 'src/app/core/services/pdf-generator.service';
import { AcreditaPipe } from 'src/app/core/pipes/acredita.pipe';
import { QtdNumerosPipe } from 'src/app/core/pipes/qtd-numeros.pipe';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { catchError, finalize, of, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
    MatCardModule,
    MatChipsModule
  ],
  templateUrl: './ficha-candidato.component.html',
  styleUrls: ['./ficha-candidato.component.scss']
})
export class FichaCandidatoComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private usuarioService = inject(AuthService);
  private pdfGenerator = inject(PdfGeneratorService);
  private destroyRef = inject(DestroyRef);

  busy = false;
  candidato: CandidatoInterface | null = null;
  idade = 0;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '0';
    this.loadCandidato(parseInt(id));
  }

  private loadCandidato(id: number): void {
    this.busy = true;
    this.usuarioService.verCandidato(id)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(data => {
          this.candidato = data;
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

  formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  async openPDF(): Promise<void> {
    if (!this.candidato) return;
    await this.pdfGenerator.generateFichaCandidato(this.candidato, this.idade);
  }
}

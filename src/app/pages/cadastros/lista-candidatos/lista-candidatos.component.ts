import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { Observable, catchError, finalize, of, tap } from 'rxjs';
import { CandidatoInterface } from 'src/app/core/interfaces/candidato';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-lista-candidatos',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatTooltipModule
  ],
  templateUrl: './lista-candidatos.component.html',
  styleUrls: ['./lista-candidatos.component.scss']
})
export class ListaCandidatosComponent implements OnInit {
  private service = inject(AuthService);

  busy = false;
  mobile = false;
  listaCandidatos: CandidatoInterface[] = [];
  displayedColumns: string[] = ['indice', 'nome', 'status', 'acoes'];

  ngOnInit(): void {
    this.mobile = window.innerWidth < 1240;
    if (this.mobile) {
      this.displayedColumns = ['nome', 'status', 'acoes'];
    }
    this.loadCandidatos();
  }

  private loadCandidatos(): void {
    this.busy = true;
    this.service.verCandidatos()
      .pipe(
        tap(data => {
          this.listaCandidatos = data;
        }),
        catchError(() => {
          return of([]);
        }),
        finalize(() => this.busy = false)
      )
      .subscribe();
  }

  getStatusClass(status: string): string {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('aprovado')) return 'status-active';
    if (statusLower.includes('reprovado')) return 'status-inactive';
    if (statusLower.includes('pendente') || statusLower.includes('analise')) return 'status-pending';
    return '';
  }
}

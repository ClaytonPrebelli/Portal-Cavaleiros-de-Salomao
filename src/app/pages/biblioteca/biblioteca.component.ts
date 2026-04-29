import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Observable, catchError, finalize, of, tap } from 'rxjs';
import { LivrosInterface } from 'src/app/core/interfaces/livros';
import { LoginResponse } from 'src/app/core/interfaces/login';
import { LivrosService } from 'src/app/core/services/livros.service';

@Component({
  selector: 'app-biblioteca',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatTooltipModule
  ],
  templateUrl: './biblioteca.component.html',
  styleUrls: ['./biblioteca.component.scss']
})
export class BibliotecaComponent implements OnInit {
  private livrosService = inject(LivrosService);

  busy = false;
  currentUser!: LoginResponse;
  livrosAprendiz: LivrosInterface[] = [];
  livrosCompanheiro: LivrosInterface[] = [];
  livrosMestre: LivrosInterface[] = [];
  
  selecionadoAprendiz = false;
  selecionadoCompanheiro = false;
  selecionadoMestre = false;

  ngOnInit(): void {
    const local: any = localStorage.getItem('MasonUser');
    if (local) {
      this.currentUser = JSON.parse(local);
      
      if (this.currentUser.isAprendiz) {
        this.verLivrosAprendiz();
      }
      if (this.currentUser.isCompanheiro) {
        this.verLivrosCompanheiro();
      }
      if (this.currentUser.isMestre) {
        this.verLivrosMestre();
      }
    }
  }

  seleciona(categoria: string): void {
    this.selecionadoAprendiz = categoria === 'aprendiz';
    this.selecionadoCompanheiro = categoria === 'companheiro';
    this.selecionadoMestre = categoria === 'mestre';
  }

  verLivrosAprendiz(): void {
    this.busy = true;
    this.livrosService.verLivrosAprendiz()
      .pipe(
        tap(data => {
          this.livrosAprendiz = data.sort((a, b) => a.nome.localeCompare(b.nome));
        }),
        catchError(() => of([])),
        finalize(() => this.busy = false)
      )
      .subscribe();
  }

  verLivrosCompanheiro(): void {
    this.busy = true;
    this.livrosService.verLivrosCompanheiro()
      .pipe(
        tap(data => {
          this.livrosCompanheiro = data.sort((a, b) => a.nome.localeCompare(b.nome));
        }),
        catchError(() => of([])),
        finalize(() => this.busy = false)
      )
      .subscribe();
  }

  verLivrosMestre(): void {
    this.busy = true;
    this.livrosService.verLivrosMestre()
      .pipe(
        tap(data => {
          this.livrosMestre = data.sort((a, b) => a.nome.localeCompare(b.nome));
        }),
        catchError(() => of([])),
        finalize(() => this.busy = false)
      )
      .subscribe();
  }
}

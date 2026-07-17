import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule, MatTabChangeEvent } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { Observable, catchError, finalize, forkJoin, of, tap } from 'rxjs';
import { LivrosInterface } from 'src/app/core/interfaces/livros';
import { LoginResponse } from 'src/app/core/interfaces/login';
import { LivrosService } from 'src/app/core/services/livros.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
    MatTooltipModule,
    MatBadgeModule
  ],
  templateUrl: './biblioteca.component.html',
  styleUrls: ['./biblioteca.component.scss']
})
export class BibliotecaComponent implements OnInit {
  private livrosService = inject(LivrosService);
  private destroyRef = inject(DestroyRef);

  busy = false;
  currentUser!: LoginResponse;
  livrosAprendiz: LivrosInterface[] = [];
  livrosCompanheiro: LivrosInterface[] = [];
  livrosMestre: LivrosInterface[] = [];
  
  selectedTab = 0;

  ngOnInit(): void {
    const local: any = localStorage.getItem('MasonUser');
    if (local) {
      this.currentUser = JSON.parse(local);
      this.loadInitialData();
    }
  }

  private loadInitialData(): void {
    this.busy = true;
    const requests: Observable<LivrosInterface[]>[] = [];

    if (this.currentUser.isAprendiz) {
      requests.push(this.livrosService.verLivrosAprendiz());
    }
    if (this.currentUser.isCompanheiro) {
      requests.push(this.livrosService.verLivrosCompanheiro());
    }
    if (this.currentUser.isMestre) {
      requests.push(this.livrosService.verLivrosMestre());
    }

    if (requests.length === 0) {
      this.busy = false;
      return;
    }

    forkJoin(requests).pipe(
      takeUntilDestroyed(this.destroyRef),
      tap(results => {
        let index = 0;
        if (this.currentUser.isAprendiz) {
          this.livrosAprendiz = (results[index++] || []).sort((a, b) => a.nome.localeCompare(b.nome));
        }
        if (this.currentUser.isCompanheiro) {
          this.livrosCompanheiro = (results[index++] || []).sort((a, b) => a.nome.localeCompare(b.nome));
        }
        if (this.currentUser.isMestre) {
          this.livrosMestre = (results[index++] || []).sort((a, b) => a.nome.localeCompare(b.nome));
        }
      }),
      catchError(() => of([])),
      finalize(() => this.busy = false)
    ).subscribe();
  }

  onTabChange(event: MatTabChangeEvent): void {
    this.selectedTab = event.index;
  }

  getLivrosForCurrentTab(): LivrosInterface[] {
    switch (this.selectedTab) {
      case 0: return this.livrosAprendiz;
      case 1: return this.livrosCompanheiro;
      case 2: return this.livrosMestre;
      default: return [];
    }
  }

  canAccessTab(tab: number): boolean {
    if (!this.currentUser) return false;
    switch (tab) {
      case 0: return this.currentUser.isAprendiz;
      case 1: return this.currentUser.isCompanheiro;
      case 2: return this.currentUser.isMestre;
      default: return false;
    }
  }

  getTabTitle(tab: number): string {
    switch (tab) {
      case 0: return 'Aprendiz';
      case 1: return 'Companheiro';
      case 2: return 'Mestre';
      default: return '';
    }
  }

  getTabIcon(tab: number): string {
    switch (tab) {
      case 0: return 'menu_book';
      case 1: return 'auto_stories';
      case 2: return 'school';
      default: return 'menu_book';
    }
  }

  getLivrosCount(grau: 'aprendiz' | 'companheiro' | 'mestre'): number {
    switch (grau) {
      case 'aprendiz': return this.livrosAprendiz.length;
      case 'companheiro': return this.livrosCompanheiro.length;
      case 'mestre': return this.livrosMestre.length;
    }
  }
}

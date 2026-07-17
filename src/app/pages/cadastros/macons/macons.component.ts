import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { RouterLink } from '@angular/router';
import { catchError, finalize, of, tap } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { Envs } from 'src/app/core/services/envs';
import { StatusInterface, UsuariosInterface } from 'src/app/core/interfaces/login';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-macons',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatTableModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatChipsModule,
    MatSnackBarModule
  ],
  templateUrl: './macons.component.html',
  styleUrls: ['./macons.component.scss']
})
export class MaconsComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  private usuariosService = inject(AuthService);
  private snackBar = inject(MatSnackBar);

  busy = false;
  fotosUrl = Envs.fotosUrl;
  page = 1;
  
  listaMacons: UsuariosInterface[] = [];
  listaStatus: StatusInterface[] = [];
  listaView: UsuariosInterface[] = [];
  
  sentenca = '';
  statusEscolhido = 0;
  
  displayedColumns: string[] = ['indice', 'foto', 'cim', 'nome', 'status', 'acoes'];

  ngOnInit(): void {
    this.loadInitialData();
  }

  private loadInitialData(): void {
    this.busy = true;

    // Load status
    this.usuariosService.listarStatus()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(data => this.listaStatus = data),
        catchError(() => of([]))
      )
      .subscribe();

    // Load maçons
    this.buscarMacons();
  }

  buscarMacons(): void {
    this.busy = true;
    this.usuariosService.listarMacons(
      this.page,
      this.statusEscolhido,
      this.sentenca
    )
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(data => {
          this.listaView = data.items.map(item => ({
            ...item,
            nome: this.capitalizeName(item.nome)
          })).sort((a, b) => a.nome.localeCompare(b.nome));
          
          this.listaMacons = this.listaView;
        }),
        catchError(error => {
          this.showMessage('Erro ao carregar maçons!', true);
          return of(null);
        }),
        finalize(() => this.busy = false)
      )
      .subscribe();
  }

  private capitalizeName(name: string): string {
    return name.toLowerCase()
      .replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
  }

  showMessage(msg: string, isError: boolean = false): void {
    this.snackBar.open(msg, '✕', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: isError ? 'msg-error' : 'msg-success'
    });
  }

  clearFilters(): void {
    this.statusEscolhido = 0;
    this.sentenca = '';
    this.buscarMacons();
  }

  getStatusClass(status: string): string {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('ativo')) return 'status-active';
    if (statusLower.includes('inativo')) return 'status-inactive';
    if (statusLower.includes('candidato')) return 'status-pending';
    return '';
  }

  handleImgError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
  }
}

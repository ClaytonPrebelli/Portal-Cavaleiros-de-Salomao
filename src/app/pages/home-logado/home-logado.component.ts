import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { LoginResponse, NiverFamiliaInterface, UsuariosInterface } from 'src/app/core/interfaces/login';
import { Observable, catchError, finalize, map, of, tap } from 'rxjs';

@Component({
  selector: 'app-home-logado',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatChipsModule,
    MatDividerModule
  ],
  templateUrl: './home-logado.component.html',
  styleUrls: ['./home-logado.component.scss']
})
export class HomeLogadoComponent implements OnInit {
  private service = inject(AuthService);
  private router = inject(Router);

  busy = false;
  userData: LoginResponse | null = null;

  listaAniversario: UsuariosInterface[] = [];
  listaNiverFamilia: NiverFamiliaInterface[] = [];

  displayedColumns: string[] = ['irmao', 'loja', 'oriente', 'data', 'idade'];
  displayedColumnsFam: string[] = ['nome', 'irmao', 'loja', 'data', 'idade'];

  ngOnInit(): void {
    const userStr = localStorage.getItem('MasonUser');
    if (userStr) {
      this.userData = JSON.parse(userStr);
    }
    this.loadAniversarios();
  }

  loadAniversarios(): void {
    this.busy = true;
    this.service.verAniversarios().pipe(
      tap(data => {
        this.listaAniversario = data.sort((a, b) =>
          new Date(a.nascimento).getDate() - new Date(b.nascimento).getDate()
        );
      }),
      catchError(error => {
        console.error('Erro ao carregar aniversários:', error);
        return of([]);
      }),
      finalize(() => this.busy = false)
    ).subscribe();

    this.service.verAniversariosFamilia().pipe(
      tap(data => {
        this.listaNiverFamilia = data.sort((a, b) =>
          new Date(a.data).getDate() - new Date(b.data).getDate()
        );
      }),
      catchError(error => {
        console.error('Erro ao carregar aniversários família:', error);
        return of([]);
      })
    ).subscribe();
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
    if (macom.isMestre) return "Mestre Maçom";
    if (macom.isCompanheiro) return "Companheiro de Ofício";
    if (macom.isAprendiz) return "Aprendiz Maçom";
    return "Candidato";
  }

  logout(): void {
    localStorage.removeItem('MasonUser');
    this.router.navigate(['/']);
  }
}

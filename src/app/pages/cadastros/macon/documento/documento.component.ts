import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Observable, catchError, finalize, of, tap } from 'rxjs';
import FileSaver from 'file-saver';
import { DocumentosResponse } from 'src/app/core/interfaces/documentos';
import { AuthService } from 'src/app/core/services/auth.service';
import { DocumentosService } from 'src/app/core/services/documentos.service';

@Component({
  selector: 'app-documento',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTabsModule,
    MatTooltipModule,
    MatChipsModule
  ],
  templateUrl: './documento.component.html',
  styleUrls: ['./documento.component.scss']
})
export class DocumentoComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);
  private usuarioService = inject(AuthService);
  private documentosService = inject(DocumentosService);

  busy = false;
  currentUser: any = null;
  usuarioId: string | null = null;
  nomeIrmao = '';
  listaDocumentos: DocumentosResponse[] = [];
  selectedFile?: File;
  textoDoc = 'Escolha um Documento';

  ngOnInit(): void {
    const local = localStorage.getItem('MasonUser');
    if (local) {
      this.currentUser = JSON.parse(local);
    }

    this.usuarioId = this.route.snapshot.paramMap.get('id');
    
    if (this.usuarioId) {
      this.loadMacomData(this.usuarioId);
      this.buscaDocumentos(this.usuarioId);
    }
  }

  private loadMacomData(id: string): void {
    this.usuarioService.verMacom(id).subscribe({
      next: (data) => {
        this.nomeIrmao = data.nome;
      },
      error: (err) => {
        this.showMessage('Erro ao carregar dados do maçom!', true);
      }
    });
  }

  buscaDocumentos(id: string): void {
    this.busy = true;
    this.documentosService.verDocumentosUsuario(id)
      .pipe(
        tap(data => {
          this.listaDocumentos = data;
        }),
        catchError(() => {
          this.showMessage('Erro ao carregar documentos!', true);
          return of([]);
        }),
        finalize(() => this.busy = false)
      )
      .subscribe();
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      this.textoDoc = this.selectedFile.name;
    }
  }

  escolheDoc(): void {
    document.getElementById('input-file')?.click();
  }

  salvar(): void {
    if (!this.selectedFile || !this.usuarioId) return;

    this.busy = true;
    this.documentosService.enviarDocumentoUsuario(this.selectedFile, this.usuarioId)
      .pipe(
        tap(() => {
          this.showMessage('Documento cadastrado com sucesso!', false);
          this.buscaDocumentos(this.usuarioId!);
          this.selectedFile = undefined;
          this.textoDoc = 'Escolha um Documento';
        }),
        catchError(() => {
          this.showMessage('Erro ao salvar documento. Tente novamente.', true);
          return of(null);
        }),
        finalize(() => this.busy = false)
      )
      .subscribe();
  }

  downloadDocumento(doc: DocumentosResponse): void {
    if (!doc.link) return;
    
    window.open(doc.link, '_blank');
  }

  showMessage(msg: string, isError: boolean = false): void {
    this.snackBar.open(msg, '✕', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: isError ? 'msg-error' : 'msg-success'
    });
  }
}

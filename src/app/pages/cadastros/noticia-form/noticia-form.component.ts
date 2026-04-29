import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NoticiasService } from 'src/app/core/services/noticias.service';
import { NoticiasInterface } from 'src/app/core/interfaces/noticias';
import { Observable, catchError, finalize, of, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-noticia-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './noticia-form.component.html',
  styleUrls: ['./noticia-form.component.scss']
})
export class NoticiaFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private noticiaService = inject(NoticiasService);
  private snackBar = inject(MatSnackBar);

  busy = false;
  noticiaForm: FormGroup;
  fotoPreview: string | ArrayBuffer | null = null;
  selectedFile?: File;
  isEditing = false;

  constructor() {
    this.noticiaForm = this.fb.group({
      id: [0],
      titulo: ['', [Validators.required, Validators.minLength(5)]],
      texto: ['', [Validators.required, Validators.minLength(50)]],
      dataPublicacao: [new Date(), Validators.required],
      autorId: [null as number | null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadNoticia();
  }

  private loadCurrentUser(): void {
    const userStr = localStorage.getItem('MasonUser');
    if (userStr) {
      const user = JSON.parse(userStr);
      this.noticiaForm.patchValue({ autorId: user.id });
    }
  }

  private loadNoticia(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id || id === '0') {
      this.isEditing = false;
      return;
    }

    this.busy = true;
    this.isEditing = true;

    this.noticiaService.verNoticia(parseInt(id))
      .pipe(
        tap(noticia => {
          const textoLimpo = noticia.texto?.replace(/<\/?p>/g, '\n').trim() || '';
          this.noticiaForm.patchValue({
            id: noticia.id,
            titulo: noticia.titulo,
            texto: textoLimpo,
            dataPublicacao: new Date(noticia.dataPublicacao),
            autorId: noticia.autorId
          });

          if (noticia.fotosNoticias?.[0]?.fotoFile) {
            this.fotoPreview = `data:image/png;base64,${noticia.fotosNoticias[0].fotoFile}`;
          }
        }),
        catchError(error => {
          this.showMessage('Notícia não encontrada!', true);
          this.router.navigate(['/cadastros/noticias']);
          return of(null);
        }),
        finalize(() => this.busy = false)
      )
      .subscribe();
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      
      const reader = new FileReader();
      reader.onload = (e) => {
        this.fotoPreview = e.target?.result || null;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  escolheFoto(): void {
    document.getElementById('input-file')?.click();
  }

  showMessage(msg: string, isError: boolean = false): void {
    this.snackBar.open(msg, '✕', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: isError ? 'msg-error' : 'msg-success'
    });
  }

  salvar(): void {
    if (this.noticiaForm.invalid || this.busy) return;

    this.busy = true;
    const formValue = this.noticiaForm.value;
    
    const textoFormatado = formValue.texto
      .split('\n')
      .filter((line: string) => line.trim())
      .map((line: string) => `<p>${line.trim()}</p>`)
      .join('');

    const noticia: NoticiasInterface = {
      id: formValue.id,
      titulo: formValue.titulo,
      texto: textoFormatado,
      dataPublicacao: formValue.dataPublicacao,
      autorId: formValue.autorId
    };

    this.noticiaService.gravarNoticia(noticia)
      .pipe(
        switchMap(savedNoticia => {
          if (this.selectedFile) {
            return this.noticiaService.gravarFotoNoticia(this.selectedFile, savedNoticia.id!);
          }
          return of(null);
        }),
        tap(() => {
          this.showMessage('Notícia salva com sucesso!', false);
          this.router.navigate(['/cadastros/noticias']);
        }),
        catchError(error => {
          this.showMessage('Erro ao salvar notícia. Tente novamente.', true);
          return of(null);
        }),
        finalize(() => this.busy = false)
      )
      .subscribe();
  }
}

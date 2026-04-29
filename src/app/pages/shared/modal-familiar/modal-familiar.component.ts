import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FamiliaresInterface } from 'src/app/core/interfaces/login';
import { AuthService } from 'src/app/core/services/auth.service';
import { Observable, catchError, finalize, of, tap } from 'rxjs';

@Component({
  selector: 'app-modal-familiar',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatProgressSpinnerModule,
    MatDialogModule
  ],
  templateUrl: './modal-familiar.component.html',
  styleUrls: ['./modal-familiar.component.scss']
})
export class ModalFamiliarComponent implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(AuthService);
  
  familiar!: FamiliaresInterface;
  listaFamiliares: FamiliaresInterface[] = [];
  idRecebido = 0;
  isCandidato = false;
  
  familiarForm: FormGroup = this.fb.group({
    id: [0],
    usuarioId: [''],
    familiarNome: ['', Validators.required],
    nascimentoFamiliar: ['', Validators.required],
    relacao: ['', Validators.required],
    telefone: ['', Validators.required],
    usuarioModelsId: [0],
    candidatosModelsId: ['']
  });

  constructor(
    public dialogRef: MatDialogRef<ModalFamiliarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.idRecebido = this.data['id'];
    this.isCandidato = this.data['candidato'];
    
    if (this.isCandidato) {
      this.familiarForm.patchValue({
        candidatosModelsId: this.idRecebido
      });
    } else {
      this.familiarForm.patchValue({
        usuarioId: this.idRecebido
      });
    }
  }

  adicionar(): void {
    if (this.familiarForm.invalid) return;
    
    this.familiar = this.familiarForm.value;
    this.listaFamiliares.push({...this.familiar, id: 0});
    this.familiarForm.reset();
    
    if (this.isCandidato) {
      this.familiarForm.patchValue({
        candidatosModelsId: this.idRecebido
      });
    } else {
      this.familiarForm.patchValue({
        usuarioId: this.idRecebido
      });
    }
  }

  remover(index: number): void {
    this.listaFamiliares.splice(index, 1);
  }

  salvar(): void {
    this.listaFamiliares.forEach(element => {
      this.service.cadastrarFamiliar(element).subscribe({
        next: () => {},
        error: () => {}
      });
    });
    this.dialogRef.close();
  }
}

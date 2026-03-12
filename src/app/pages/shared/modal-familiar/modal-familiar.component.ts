import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FamiliaresInterface } from 'src/app/core/interfaces/login';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-modal-familiar',
  templateUrl: './modal-familiar.component.html',
  styleUrls: ['./modal-familiar.component.scss']
})
export class ModalFamiliarComponent implements OnInit{
familiar!:FamiliaresInterface
listaFamiliares:FamiliaresInterface[]=[]
idRecebido=0  
isCandidato = false
familiarForm:FormGroup = new FormGroup({
  id: new FormControl(0),
  usuarioId: new FormControl(''),
  familiarNome: new FormControl('',[Validators.required]),
  nascimentoFamiliar: new FormControl('',[Validators.required]),
  relacao: new FormControl('',[Validators.required]),
  candidatosModelsId: new FormControl(''),
  usuarioModelsId: new FormControl(0),
  telefone: new FormControl('',[Validators.required]),

})
constructor(public dialogRef: MatDialogRef<ModalFamiliarComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any, private service: AuthService){}

  ngOnInit(): void {
    this.idRecebido = this.data['id']
    this.isCandidato = this.data['candidato']
    if(this.isCandidato){
    this.familiarForm.value.usuarioId = this.idRecebido
    this.familiarForm.value.candidatosModelsId = this.idRecebido
    }else{
      this.familiarForm.value.usuarioId = this.idRecebido
    this.familiarForm.value.usuarioModelsId = this.idRecebido
    }

  }
  adicionar(){
    if(this.isCandidato){
    this.familiar = this.familiarForm.value
    this.familiar.id = 0
    this.familiar.usuarioId = this.idRecebido
    this.familiar.candidatosModelsId = this.idRecebido
    this.familiar.usuarioModelsId = 0
    this.listaFamiliares.push(this.familiar)
    this.familiarForm.reset()
    this.familiarForm.value.id = 0,
    this.familiarForm.value.usuarioId = this.idRecebido
    this.familiarForm.value.candidatosModelsId = this.idRecebido
    this.familiar.usuarioModelsId = 0
    }else{
      this.familiar = this.familiarForm.value
      this.familiar.id = 0
      this.familiar.usuarioId = this.idRecebido
      this.familiar.usuarioModelsId = this.idRecebido
      this.familiar.candidatosModelsId = 0
      this.listaFamiliares.push(this.familiar)
      this.familiarForm.reset()
      this.familiarForm.value.id = 0,
      this.familiarForm.value.usuarioId = this.idRecebido
      this.familiarForm.value.usuarioModelsId = this.idRecebido
      this.familiar.candidatosModelsId = 0
    }
  }
  remover(index:number){
      this.listaFamiliares.splice(index,1)
  }
  salvar(){
      this.listaFamiliares.forEach(element => {
          this.service.cadastrarFamiliar(element).subscribe(data=>{});
      });
      this.dialogRef.close();
  }
}

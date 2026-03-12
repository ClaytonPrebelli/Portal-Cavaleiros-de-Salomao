import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { CandidatoInterface } from 'src/app/core/interfaces/candidato';
import { AuthService } from 'src/app/core/services/auth.service';
import { ModalFamiliarComponent } from '../../shared/modal-familiar/modal-familiar.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-candidatos',
  templateUrl: './candidatos.component.html',
  styleUrls: ['./candidatos.component.scss']
})
export class CandidatosComponent implements OnInit{
busy=false
candidatoEnviar!:CandidatoInterface
token=''
candidatoId= 0
listaEstados=['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO']
candidatoForm:FormGroup = new FormGroup({
  id: new FormControl(0,[Validators.required]),
  nome:new FormControl("",[Validators.required]),
  cpf:new FormControl("",[Validators.required]),
  rg:new FormControl("",[Validators.required]),
  dataExpedicao: new FormControl('',[Validators.required]),
  nascimento: new FormControl('',[Validators.required]),
  religiao: new FormControl('',[Validators.required]),
  acreditaSerSupremo: new FormControl('',[Validators.required]),
  naturalidade: new FormControl('',[Validators.required]),
  estado: new FormControl('',[Validators.required]),
  nacionalidade: new FormControl('',[Validators.required]),
  estadoCivil: new FormControl('',[Validators.required]),
  tipoSanguineo: new FormControl('',[Validators.required]),
  profissao: new FormControl('',[Validators.required]),
  endereco: new FormControl('',[Validators.required]),
  numero: new FormControl('',[Validators.required]),
  cep: new FormControl('',[Validators.required]),
  cidade: new FormControl('',[Validators.required]),
  bairro: new FormControl('',[Validators.required]),
  tempoMoradia: new FormControl('',[Validators.required]),
  email: new FormControl('',[Validators.required]),
  fone: new FormControl('',[Validators.required]),
  renda: new FormControl('',[Validators.required]),
  pai: new FormControl('',[Validators.required]),
  mae: new FormControl('',[Validators.required]),
  paiMacom: new FormControl(false),
  dataCadastro: new FormControl(new Date(),[Validators.required]),
  vicios: new FormControl('',[Validators.required]),
  aptidoes: new FormControl('',[Validators.required]),
  foneEmergencia: new FormControl('',[Validators.required]),
  contatoEmergencia: new FormControl('',[Validators.required]),
  familiaConcorda: new FormControl('',[Validators.required]),
  statusId: new FormControl(3,[Validators.required]),
  quemIndica: new FormControl(1,[Validators.required]),
  motivos: new FormControl('',[Validators.required]),
  
})
showMessage(msg: string, isError: boolean = false): void {
  this.snackBar.open(msg, 'X', {
    duration: 5000,
    horizontalPosition: 'center',
    verticalPosition: "top",
    panelClass: isError ? ['msg-error'] : ['msg-success']
  })
}
constructor(private route:ActivatedRoute, private service :AuthService,private modal:MatDialog,private snackBar: MatSnackBar ){}
ngOnInit(): void {
   this.candidatoForm.value.paiMacom = false;
  this.token = this.route.snapshot.paramMap.get('token')?.toString()??''
  this.service.validaToken(this.token).subscribe(data=>{
    console.log(data)
  },error=>{
    this.showMessage("Token de acesso já utilizado ou expirado.",true)
    setTimeout(()=>{
      window.location.href = "https://glumbsp.com.br"
    } , 7000)
  
  })
}
salvar(){
 this.busy=true
this.candidatoEnviar = this.candidatoForm.value

this.service.cadastrarCandidato(this.candidatoEnviar,this.token).subscribe(data=>{
  this.candidatoId = data.id
 const dialogRef = this.modal.open(ModalFamiliarComponent, {
    data: {id:this.candidatoId,candidato:true},
    width:'90vw',
    height:'90vh'
  })
  dialogRef.afterClosed().subscribe(data=>{
    this.showMessage("Sua ficha foi enviada. Iremos analisar e retornar o contato.",false)
    this.showMessage("Token de acesso já utilizado ou expirado.",true)
    setTimeout(()=>{
      window.location.href = "https://glumbsp.com.br"
    } , 7000)
  })
  this.busy=false
},error=>{
  console.log(error)
  this.busy=false;
})
}
}

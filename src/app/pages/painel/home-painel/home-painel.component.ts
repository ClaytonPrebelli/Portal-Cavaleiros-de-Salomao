import { Component, OnInit } from '@angular/core';
import FileSaver from 'file-saver';
import { dash } from 'pdfkit';
import {  FotoInterface } from 'src/app/core/interfaces/foto';
import { FamiliaresInterface, LoginResponse, UsuariosInterface } from 'src/app/core/interfaces/login';
import { AuthService } from 'src/app/core/services/auth.service';
import { LojasService } from 'src/app/core/services/lojas.service';

@Component({
  selector: 'app-home-painel',
  templateUrl: './home-painel.component.html',
  styleUrls: ['./home-painel.component.scss']
})
export class HomePainelComponent implements OnInit {
busy=false
currentUser!:LoginResponse
fotoLoja:FotoInterface={
  fotoFile:[],
  fotoName:"",
  id:0
}
nomeLoja=""
macom:UsuariosInterface={
  bairro:"",
  cargo:"",
  cep:"",
  cidade:"",
  cim:0,
  contatoEmergencia:"",
  cpf:"",
  dataAfiliacao:new Date(),
  email:"",
  endereco:"",
  estado:"",
  estadoCivil:"",
  fone:"",
  foneEmergencia:"",
  formaAfiliacao:"",
  id:0,
  iniciacao:new Date(),
  isAdmin:true,
  isAprendiz:true,
  isCandidato:false,
  isCompanheiro:false,
  isMestre:false,
  isSuperAdmin:false,
  lojaId:0,
  mae:"",
  nacionalidade:"",
  naturalidade:"",
  nascimento: new Date(),
nome:"",
numero:"",
observacoes:"",
pai:"",
pass:"",
profissao:"",
rg:"",
elevacao:new Date(),
exaltacao: new Date(),
statusId:0,
tipoSanguineo:"",
titulo:" ",
loja:{
  ativa:true,
  dataFundacao:new Date(),
  documentos:[],
  endereco:"",
  estado:"",
  id:0,
  instagram:"",
  nomeLoja:"",
  numeroLoja:0,
  oriente:"",
  rito:"",
  veneravel:0
} ,


}
simb=''

hoje="00/0000"
validade = "00/0000"
constructor(private userService:AuthService, private lojaService:LojasService){}
ngOnInit(): void {
  var hojeTemp = new Date();
  this.hoje = (hojeTemp.getMonth()+1).toString()+"/"+hojeTemp.getFullYear().toString() 
  this.validade = (hojeTemp.getMonth()+1).toString()+"/"+(hojeTemp.getFullYear()+1).toString() 
  this.busy = true
  var local:any = localStorage.getItem("MasonUser")
  local = JSON.parse(local)
  if(local){
    this.currentUser = local
     this.userService.verMacom(this.currentUser.id).subscribe(macom=>{
      this.macom = macom
      if(macom.loja){
        this.nomeLoja=macom.loja.nomeLoja
      }
    
     })
  }
this.busy = false
}
pad(numero:number|null){

  return numero?.toString().padStart(6,'0')
 }
 grau(macom:UsuariosInterface){
  if(macom.isMestre){
    return "Mestre Maçom"
  }else if(macom.isCompanheiro){
    return "Companheiro de Ofício"
  }else{
    return "Aprendiz Admitido"
  }
 }
getAge(dateString:string) {
  const today = new Date();
  const birthDate = new Date(dateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
  }
  
  return age;
}
validaGrauSimb(macom:UsuariosInterface){
  if(macom.isMestre){
    return "Mestre Maçom"
  }else if(macom.isCompanheiro){
    return "Companheiro de Ofício"
  }else if (macom.isAprendiz){
    return "Aprendiz Maçom"
  }else{
    return "Candidato"
  }
}

public openPDF(): void {
        
  this.userService.gerarCarteirinha(this.macom.id).subscribe(data=>{
    var content= this.base64ToArrayBuffer(data);
  //var blob = new Blob([content], { type: 'document/pdf' });
    
   // FileSaver.saveAs(blob,`CIM ${this.macom.nome}.pdf` )
   const linkSource = 'data:application/pdf;base64,' + data;
   const downloadLink = document.createElement("a");
   const fileName = `CIM ${this.macom.nome}.pdf`;

   downloadLink.href = linkSource;
   downloadLink.download = fileName;
   downloadLink.click();
  })

}
base64ToArrayBuffer(base64: any): ArrayBuffer {
var binary_string = window.atob(base64);
var len = binary_string.length;
var bytes = new Uint8Array(len);
for (var i = 0; i < len; i++) {
bytes[i] = binary_string.charCodeAt(i);
}
return bytes.buffer;
}
}

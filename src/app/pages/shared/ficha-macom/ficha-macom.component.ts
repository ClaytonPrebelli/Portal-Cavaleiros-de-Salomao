import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { FotoInterface } from 'src/app/core/interfaces/foto';
import { UsuariosInterface } from 'src/app/core/interfaces/login';
import { LojasInterface } from 'src/app/core/interfaces/lojas';
import { AuthService } from 'src/app/core/services/auth.service';
import { LojasService } from 'src/app/core/services/lojas.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import FileSaver from 'file-saver';
@Component({
  selector: 'app-ficha-macom',
  templateUrl: './ficha-macom.component.html',
  styleUrls: ['./ficha-macom.component.scss']
})
export class FichaMacomComponent implements OnInit{
busy=false;
macom!:UsuariosInterface


idade=0
grauSimb = "";
constructor(private usuarioService:AuthService, private router:ActivatedRoute,private lojasService:LojasService){}


ngOnInit(): void {
    var id:string = this.router.snapshot.paramMap.get("id")??"0"
    var buscaId = id?id:0

    this.usuarioService.verMacom(parseInt(buscaId.toString())).subscribe(data=>{
      this.macom=data
      
     this.grauSimb = this.validaGrauSimb(this.macom)
    this.idade = this.getAge(this.macom.nascimento.toString())
     
    })
}
capitalize(texto:string){
 
  const finalSentence =  texto.toLowerCase().replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
  return finalSentence
}
pad(numero:number|null){

 return numero?.toString().padStart(6,'0')
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
  this.usuarioService.baixarFichaMacom(this.macom.id,this.idade).subscribe(data=>{
    var content= this.base64ToArrayBuffer(data);
  var blob = new Blob([content], { type: 'document/pdf' });
    
    FileSaver.saveAs(blob,`Ficha - ${this.macom.nome}.pdf` )
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

import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import FileSaver from 'file-saver';
import { DocumentosInterface, DocumentosResponse } from 'src/app/core/interfaces/documentos';
import { LoginResponse } from 'src/app/core/interfaces/login';
import { AuthService } from 'src/app/core/services/auth.service';
import { DocumentosService } from 'src/app/core/services/documentos.service';

@Component({
  selector: 'app-documento',
  templateUrl: './documento.component.html',
  styleUrls: ['./documento.component.scss']
})
export class DocumentoComponent implements OnInit{
busy=false
currentUser!:LoginResponse
selecionadoVer=true
selecionadoCadastrar=false
usuario: string|null = ""
listaDocumentos:DocumentosResponse[]=[]
nomeIrmao = ""
documento=''
textoDoc='Escolha um Documento'
hide=true;
file!: File;
arquivoFoto!:string|ArrayBuffer|null;
showMessage(msg: string, isError: boolean = false): void {
  this.snackBar.open(msg, 'X', {
    duration: 5000,
    horizontalPosition: 'center',
    verticalPosition: "top",
    panelClass: isError ? ['msg-error'] : ['msg-success']
  })
}  
constructor(private documentosService:DocumentosService, private route:ActivatedRoute,private snackBar: MatSnackBar,private usuarioService:AuthService){
}
  ngOnInit():void{
    var local:any = localStorage.getItem("MasonUser")
    local = JSON.parse(local)
    this.currentUser = local
    this.usuario = this.route.snapshot.paramMap.get("id")
    this.usuarioService.verMacom(this.usuario).subscribe(data=>{
      this.nomeIrmao = data.nome
    })
    this.buscaDocumentos(this.usuario)
  }

  seleciona(altera:string){
    
    if(altera=="ver"){
      
      this.selecionadoVer = true
      this.selecionadoCadastrar = false
    }
    if(altera=="cadastrar"){
      this.selecionadoVer = false
      this.selecionadoCadastrar = true
    }
    
  
  }
  buscaDocumentos(id:any){
    this.busy = true
    this.documentosService.verDocumentosUsuario(this.usuario).subscribe(data=>{
      this.listaDocumentos = data
      this.busy=false
    }, error=>{
      this.busy = false
    })
  }
  onFileChange(event:any){
    this.file = <File>event.target.files[0]

    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
       var ok = event.target.result;
       this.arquivoFoto = ok
       this.documento = this.arquivoFoto?.toString()?this.arquivoFoto?.toString():''
      }
      reader.readAsDataURL(event.target.files[0]);
      this.textoDoc = this.file.name
    }
  }
  escolheDoc(){
    document.getElementById('input-file')!.click();
  }
  formataData(data:any){
    var stringData = new Date(data).toLocaleDateString()
    var splitData = stringData.split("/").reverse()
    var dataFormatada = splitData[0]+"-"+splitData[1]+"-"+splitData[2]
    return dataFormatada
  }
  salvar(){
    this.busy = true
      this.documentosService.enviarDocumentoUsuario(this.file,this.usuario).subscribe(dataFoto=>{
        this.showMessage("Documento cadastrado com sucesso",false)
        this.busy=false
        this.buscaDocumentos(this.usuario)
      },error=>{
        this.showMessage("Houve um erro, contate o administrador",true)
        this.busy=false
      })
}


}


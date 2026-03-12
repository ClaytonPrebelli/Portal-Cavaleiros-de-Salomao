import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { FotoNoticiaInterface } from 'src/app/core/interfaces/foto';
import { NoticiasInterface } from 'src/app/core/interfaces/noticias';
import { NoticiasService } from 'src/app/core/services/noticias.service';

@Component({
  selector: 'app-noticia-form',
  templateUrl: './noticia-form.component.html',
  styleUrls: ['./noticia-form.component.scss']
})
export class NoticiaFormComponent implements OnInit{
  busy=false;
  file!: File;
  arquivoFoto!:string|ArrayBuffer|null;
  noticiaForm:FormGroup = new FormGroup({
    id: new FormControl('',[Validators.required]),
    titulo: new FormControl('',[Validators.required]),
    texto: new FormControl('',[Validators.required]),
    dataPublicacao: new FormControl('',[Validators.required]),
    autorId:new FormControl('',[Validators.required])
  })
  foto=''
  textoFoto='Escolha uma imagem'
  acao = 'criar'
  fotoNoticia!:FotoNoticiaInterface
  showMessage(msg: string, isError: boolean = false): void {
    this.snackBar.open(msg, 'X', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: "top",
      panelClass: isError ? ['msg-error'] : ['msg-success']
    })
  }  
  constructor(private route:ActivatedRoute,private noticiaService:NoticiasService,private snackBar: MatSnackBar,private router:Router){}
  ngOnInit(): void {
    this.busy=true
    var currentUser:any = localStorage.getItem('MasonUser')
    currentUser = JSON.parse(currentUser)
   
      var id = this.route.snapshot.paramMap.get('id');
      
      if(id!=null){
        this.noticiaService.verNoticia(parseInt(id)).subscribe(data=>{
          this.noticiaForm.controls['id'].setValue(data.id)
          this.noticiaForm.controls['titulo'].setValue(data.titulo)
          var texto = data.texto.replace("</p>","\n").replace("<p>","")
          this.noticiaForm.controls['texto'].setValue(texto)
          this.noticiaForm.controls['dataPublicacao'].setValue(data.dataPublicacao)
          this.noticiaForm.controls['autorId'].setValue(data.autorId)
          this.foto =  `data:image/png;base64,${data.fotosNoticias![0].fotoFile}`
          this.fotoNoticia = data.fotosNoticias![0]
          this.acao='editar'
          this.busy=false
        },error=>{
          if(error.status==404 && id!="0"){
            this.showMessage("Nenhuma notícia encontrada!",true)
            this.noticiaForm.controls['id'].setValue(0)
            this.noticiaForm.controls['autorId'].setValue(currentUser.id)
            this.noticiaForm.controls['dataPublicacao'].setValue(new Date)
            this.acao = 'criar'
            console.log(this.noticiaForm.value)
            this.busy=false
          }
          this.noticiaForm.controls['id'].setValue(0)
          this.noticiaForm.controls['autorId'].setValue(currentUser.id)
          this.noticiaForm.controls['dataPublicacao'].setValue(new Date)
          this.acao = 'criar'
          console.log(this.noticiaForm.value)
          this.busy=false
        
        })
      }else{
        this.noticiaForm.controls['id'].setValue(0)
        this.noticiaForm.controls['autorId'].setValue(currentUser.id)
        this.noticiaForm.controls['dataPublicacao'].setValue(new Date)
        this.acao = 'criar'
        console.log(this.noticiaForm.value)
        this.busy=false
      }
      }
      onFileChange(event:any){
        this.file = <File>event.target.files[0]
    
        if (event.target.files && event.target.files[0]) {
          var reader = new FileReader();
          reader.onload = (event: any) => {
           var ok = event.target.result;
           this.arquivoFoto = ok
           this.foto = this.arquivoFoto?.toString()?this.arquivoFoto?.toString():''
          }
          reader.readAsDataURL(event.target.files[0]);
          this.textoFoto = this.file.name
        }
      }
      escolheFoto(){
        document.getElementById('input-file')!.click();
      }
      salvar(){
       
        this.busy = true
        if(this.acao=="criar"){
              var listaTexto = []
              listaTexto = this.noticiaForm.value.texto.split("\n")
              this.noticiaForm.value.texto=''
              for(let i=0;i<listaTexto.length;i++){
                this.noticiaForm.value.texto += `<p>${listaTexto[i]}</p>`
              }
              var noticiaEnviar:NoticiasInterface={
                id:this.noticiaForm.value.id,
                autorId:this.noticiaForm.value.autorId,
                dataPublicacao:this.noticiaForm.value.dataPublicacao,
                texto:this.noticiaForm.value.texto,
                titulo:this.noticiaForm.value.titulo
              }
              this.noticiaService.gravarNoticia(noticiaEnviar).subscribe(data=>{
                    this.noticiaService.gravarFotoNoticia(this.file,data.id).subscribe(dataFoto=>{
                      this.showMessage("Notícia cadastrada com sucesso",false)
                      this.busy=false
                      this.router.navigate(['/cadastros/noticias'])
                    },error=>{
                      this.showMessage("Houve um erro, contate o administrador",true)
                      this.busy=false
                    })
              },error=>{
                this.showMessage("Houve um erro, contate o administrador",true)
                this.busy=false
              })
            }else{
              var listaTexto = []
              listaTexto = this.noticiaForm.value.texto.split("\n")
              this.noticiaForm.value.texto=''
              for(let i=0;i<listaTexto.length;i++){
                this.noticiaForm.value.texto += `<p>${listaTexto[i]}</p>`
              }
              var noticiaEnviar:NoticiasInterface={
                id:this.noticiaForm.value.id,
                autorId:this.noticiaForm.value.autorId,
                dataPublicacao:this.noticiaForm.value.dataPublicacao,
                texto:this.noticiaForm.value.texto,
                titulo:this.noticiaForm.value.titulo
              }
              this.noticiaService.gravarNoticia(noticiaEnviar).subscribe(data=>{
                    this.noticiaService.gravarFotoNoticia(this.file,data.id).subscribe(dataFoto=>{
                      this.showMessage("Notícia cadastrada com sucesso",false)
                      this.busy=false
                      this.router.navigate(['/cadastros/noticias'])
                    },error=>{
                      this.showMessage("Houve um erro, contate o administrador",true)
                      this.busy=false
                    })
              },error=>{
                this.showMessage("Houve um erro, contate o administrador",true)
                this.busy=false
              })
            }
    }
  }


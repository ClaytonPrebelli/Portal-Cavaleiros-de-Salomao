import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { LivrosInterface } from 'src/app/core/interfaces/livros';
import { LoginResponse } from 'src/app/core/interfaces/login';
import { LivrosService } from 'src/app/core/services/livros.service';


@Component({
  selector: 'app-biblioteca',
  templateUrl: './biblioteca.component.html',
  styleUrls: ['./biblioteca.component.scss']
})
export class BibliotecaComponent implements OnInit{
busy=false 
currentUser!:LoginResponse
livrosAprendiz!:LivrosInterface[]
livrosCompanheiro!:LivrosInterface[]
livrosMestre!:LivrosInterface[]
selecionadoAprendiz=false
selecionadoCompanheiro=false
selecionadoMestre=false

constructor(private livrosService:LivrosService){}

ngOnInit(): void {
    var local:any = localStorage.getItem("MasonUser")
    local = JSON.parse(local)
    this.currentUser = local
    if(this.currentUser.isAprendiz){
        this.verLivrosAprendiz()
    }
     if (this.currentUser.isCompanheiro){
      this.verLivrosCompanheiro()
    }
     if (this.currentUser.isMestre){
      this.verLivrosMestre()
    }
}
seleciona(categoria:string){
    if(categoria=="aprendiz"){
        this.selecionadoCompanheiro = false
        this.selecionadoMestre = false
        this.selecionadoAprendiz = true
    }else if(categoria=="companheiro"){
      this.selecionadoAprendiz = false;
      this.selecionadoCompanheiro = true;
      this.selecionadoMestre = false;
    }else if(categoria=="mestre"){
      this.selecionadoAprendiz = false;
      this.selecionadoCompanheiro = false;
      this.selecionadoMestre = true;
    }
}
verLivrosAprendiz(){
  
    this.livrosService.verLivrosAprendiz().subscribe(data=>{
        this.livrosAprendiz = data.sort(function (a, b) {
            if (a.nome > b.nome) {
              return 1;
            }
            if (a.nome < b.nome) {
              return -1;
            }
            // a must be equal to b
            return 0;
          })
       
    })
}
verLivrosCompanheiro(){
  this.livrosService.verLivrosCompanheiro().subscribe(data=>{
    this.livrosCompanheiro = data.sort(function (a, b) {
        if (a.nome > b.nome) {
          return 1;
        }
        if (a.nome < b.nome) {
          return -1;
        }
        // a must be equal to b
        return 0;
      })
   
})
}
verLivrosMestre(){
  this.livrosService.verLivrosMestre().subscribe(data=>{
    this.livrosMestre = data.sort(function (a, b) {
        if (a.nome > b.nome) {
          return 1;
        }
        if (a.nome < b.nome) {
          return -1;
        }
        // a must be equal to b
        return 0;
      })
   
})
}
}

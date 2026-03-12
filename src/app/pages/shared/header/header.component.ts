import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoginResponse } from 'src/app/core/interfaces/login';
import { AuthService } from 'src/app/core/services/auth.service';
import { ModalTokenComponent } from '../modal-token/modal-token.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit{
  currentUser!:LoginResponse
  exibeHamb = false;
  menuHamburguer = document.querySelector('#menuHamburguer') as HTMLElement;
  constructor(private authService:AuthService, private router: Router,private modal:MatDialog){}
ngOnInit(): void {
  
  this.menuHamburguer = document.querySelector('#menuHamburguer') as HTMLElement;
  var local:any = localStorage.getItem("MasonUser")
      local = JSON.parse(local)
      if(local){
        this.currentUser = local
        this.authService.verificaAtivo(this.currentUser.id).subscribe(
          data=>{
            
          }, error=>{
            localStorage.removeItem("MasonUser")
            this.router.navigate(["login"])
          }
        )
      }else{
        this.router.navigate(["login"])
      }

   }
   showHamb(){
    console.log("entrou")
    this.menuHamburguer = document.querySelector('#menuHamburguer') as HTMLElement;
    this.exibeHamb = !this.exibeHamb;
    if(this.exibeHamb){
      this.menuHamburguer.style.left = '0';
    }else{
      this.menuHamburguer.style.left = '-100%';
    }
  
  
  }
  
   sair(){
    localStorage.removeItem("MasonUser")
    this.router.navigate(["login"])
   }
   gerarToken(){
    var token ='https://restrito.glumbsp.com.br/cadastro/candidato/'
    this.authService.gerarToken(this.currentUser.id).subscribe(data=>{
      token += data
      this.abrirModal(token)
    },error=>{
      
      token += error.error.text
      this.abrirModal(token)
    })

   }
   abrirModal(token:string){
    
    const dialogRef = this.modal.open(ModalTokenComponent, {
      data: {link:token},
      
    })
   }
}

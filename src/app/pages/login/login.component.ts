import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginParams } from 'src/app/core/interfaces/login';
import { AuthService } from 'src/app/core/services/auth.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{
  busy=false;
  hide=true;
loginForm:FormGroup = new FormGroup({
  cpf: new FormControl('',[Validators.required]),
  pass:new FormControl('',[Validators.required])
})

showMessage(msg: string, isError: boolean = false): void {
  this.snackBar.open(msg, 'X', {
    duration: 5000,
    horizontalPosition: 'center',
    verticalPosition: "top",
    panelClass: isError ? ['msg-error'] : ['msg-success']
  })
}  

  constructor(private route :Router, private authService: AuthService,private snackBar: MatSnackBar){}
  ngOnInit(): void {

      if (localStorage.getItem("MasonUser")){
     
        this.route.navigate(['/home'])
      }
    
  }

  login(){
    this.busy=true
    
    var login:LoginParams = this.loginForm.value
    login.pass = login.pass.replace(".","").replace("-","").replace(" ","")
        this.authService.login(login).subscribe(data=>{
          console.log(data)
          localStorage.setItem('MasonUser',JSON.stringify(data))
          if(data.titulo){
            this.showMessage(`Bem vindo Ir.'. ${data.titulo} ${data.nome}`,false)
          }else{
          this.showMessage(`Bem vindo Ir.'. ${data.nome}`,false)
          }
          this.route.navigate(["/home"])
          this.busy=false
        },(error)=>{

          if(error.status==404){
            this.showMessage("Usuário ou senha inválidos!",true)
            this.busy=false
          }
          this.busy=false
        })
  }
  limpar(){
    this.loginForm.reset()
  }
}

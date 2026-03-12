import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { AuthGuardGuard } from 'src/app/core/guards/auth-guard.guard';
import { StatusInterface, UsuariosInterface } from 'src/app/core/interfaces/login';
import { LojasInterface } from 'src/app/core/interfaces/lojas';
import { AuthService } from 'src/app/core/services/auth.service';
import { LojasService } from 'src/app/core/services/lojas.service';

@Component({
  selector: 'app-macons',
  templateUrl: './macons.component.html',
  styleUrls: ['./macons.component.scss']
})
export class MaconsComponent implements OnInit {
  busy=false;
  showMessage(msg: string, isError: boolean = false): void {
    this.snackBar.open(msg, 'X', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: "top",
      panelClass: isError ? ['msg-error'] : ['msg-success']
    })
  }  
  page=1
  listaLojas:LojasInterface[]=[]
  listaMacons:UsuariosInterface[]=[]
  listaStatus:StatusInterface[]=[]
  listaView!:UsuariosInterface[];
  lojaEscolhida =0;
  sentenca = "";
statusEscolhido = 0
  dataSource = new MatTableDataSource<UsuariosInterface>();
  displayedColumns: string[] = ['indice','foto','cim','nome','loja','status','acoes'];
  constructor(private usuariosService:AuthService,private snackBar: MatSnackBar, private lojasService:LojasService){}
  ngOnInit(): void {
    
    this.lojasService.verLojasAtivas().subscribe(data=>{
      this.listaLojas=data
    })
    this.usuariosService.listarStatus().subscribe(data=>{
this.listaStatus = data
    })
    this.busy=true;
      this.usuariosService.listarMacons().subscribe(data=>{
        this.listaView = data.items
        this.listaView.forEach(item=>{
          item.nome = item.nome.toLowerCase();
          const finalSentence = item.nome.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
          item.nome = finalSentence
        })
        this.listaView.sort(function (a, b) {
          if (a.nome > b.nome) {
            return 1;
          }
          if (a.nome < b.nome) {
            return -1;
          }
          // a must be equal to b
          return 0;
        });
        this.listaMacons = this.listaView
        this.dataSource.data = this.listaView
        this.busy=false
      })
  }
  buscarMacons(){
    this.busy=true;
    this.listaView=[]
    this.usuariosService.listarMacons(this.page, this.lojaEscolhida,this.statusEscolhido,this.sentenca).subscribe(data=>{
      this.listaView = data.items
      this.listaView.forEach(item=>{
        item.nome = item.nome.toLowerCase();
        const finalSentence = item.nome.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
        item.nome = finalSentence
      })
      this.listaView.sort(function (a, b) {
        if (a.nome > b.nome) {
          return 1;
        }
        if (a.nome < b.nome) {
          return -1;
        }
        // a must be equal to b
        return 0;
      });
      this.listaMacons = this.listaView
      this.dataSource.data = this.listaView
      this.busy=false
  })
}
  
 
}

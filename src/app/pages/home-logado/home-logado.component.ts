import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { LoginResponse, NiverFamiliaInterface, UsuariosInterface } from 'src/app/core/interfaces/login';
import { AuthService } from 'src/app/core/services/auth.service';


@Component({
  selector: 'app-home-logado',
  templateUrl: './home-logado.component.html',
  styleUrls: ['./home-logado.component.scss']
})
export class HomeLogadoComponent implements OnInit{
busy = false;
listaAniversario:UsuariosInterface[]=[]
listaNiverFamilia:NiverFamiliaInterface[]=[]
dataSource = new MatTableDataSource<UsuariosInterface>
dataSourceFamilia = new MatTableDataSource<NiverFamiliaInterface>
displayedColumns: string[] = ['irmao','loja','oriente','data','idade'];
displayedColumnsFam: string[] = ['nome','irmao','loja','data','idade'];
  constructor(private service: AuthService){  }

  ngOnInit(): void {
    this.busy = true;
    this.service.verAniversarios().subscribe(data=>{
      this.listaAniversario = data;
      this.dataSource.data=[];
      this.dataSource.data = this.listaAniversario.sort(function(a,b) {
        return new Date(a.nascimento).getDate() < new Date(b.nascimento).getDate() ? -1 : new Date(a.nascimento).getDate() > new Date(b.nascimento).getDate() ? 1 : 0;
    })
      this.buscaFamilia()
      this.busy = false;
    })
    

  }
 buscaFamilia(){
  this.busy = true;
  this.service.verAniversariosFamilia().subscribe(data=>{
    this.listaNiverFamilia = data;
    this.dataSourceFamilia.data=[];
    this.dataSourceFamilia.data = this.listaNiverFamilia.sort(function(a,b) {
      return new Date(a.data).getDate() < new Date(b.data).getDate() ? -1 : new Date(a.data).getDate() > new Date(b.data).getDate() ? 1 : 0;
  })
  })
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
}

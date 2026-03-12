import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { NoticiasInterface, NoticiasResponse } from 'src/app/core/interfaces/noticias';
import { NoticiasService } from 'src/app/core/services/noticias.service';

@Component({
  selector: 'app-noticias',
  templateUrl: './noticias.component.html',
  styleUrls: ['./noticias.component.scss']
})
export class NoticiasComponent implements OnInit{
  busy=false;
page=1;
pageSize=10;
  showMessage(msg: string, isError: boolean = false): void {
    this.snackBar.open(msg, 'X', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: "top",
      panelClass: isError ? ['msg-error'] : ['msg-success']
    })
  }  
  listaView!:NoticiasResponse;
  dataSource = new MatTableDataSource<NoticiasInterface>();
  displayedColumns: string[] = ['id','titulo','data','acoes'];
  constructor(private noticiasService:NoticiasService,private snackBar: MatSnackBar){}
  ngOnInit(): void {
    this.busy=true;
      this.noticiasService.listarNoticias(this.page,this.pageSize).subscribe(data=>{
        this.listaView = data
      
        if(this.listaView.noticias.length==0){
          this.showMessage("Nenhuma notícia encontrada!",true)
          this.busy=false
        }
       this.dataSource.data = this.listaView.noticias
        this.busy = false
      },(error)=>{
        if(error.status==404){
          this.showMessage("Nenhuma notícia encontrada!",true)
          this.busy=false
        }
        this.busy=false
      })
  }
  ngAfterViewInit(){

  }

}

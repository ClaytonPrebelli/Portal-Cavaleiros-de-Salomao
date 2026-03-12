import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { BreadInterface } from 'src/app/core/interfaces/breadcumb';

@Component({
  selector: 'app-breadcumb',
  templateUrl: './breadcumb.component.html',
  styleUrls: ['./breadcumb.component.scss']
})

export class BreadcumbComponent implements OnInit{
routepath:BreadInterface[]=[]

constructor(private route: Router){}
ngOnInit(): void {
    var url = this.route.url.split("/")
  for(let i=0;i<url.length;i++){
    if(url[i]!=""){

      if(url[i-1]==""){
        var objetoRota:BreadInterface = {
          rota : `${url[i-1]}/${url[i]}`,
          title: `${url[i]}`
      }
    }else{
      var objetoRota:BreadInterface = {
        rota : `/${url[i-1]}/${url[i]}`,
        title: `${url[i]}`
      }
    }
      this.routepath.push(objetoRota)
    }
  }

}
}

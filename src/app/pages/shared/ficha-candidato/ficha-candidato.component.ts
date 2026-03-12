import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {jsPDF}from 'jspdf';
import html2canvas from 'html2canvas';
import { CandidatoInterface } from 'src/app/core/interfaces/candidato';
import { AuthService } from 'src/app/core/services/auth.service';
import htmlToPdfmake from 'html-to-pdfmake';
import FileSaver, { saveAs } from 'file-saver';
@Component({
  selector: 'app-ficha-candidato',
  templateUrl: './ficha-candidato.component.html',
  styleUrls: ['./ficha-candidato.component.scss'],
})
export class FichaCandidatoComponent implements OnInit {
  busy = false;
  candidato: CandidatoInterface = {
   id:0,
       nome:'',
       cpf:'', 
       rg:'', 
       dataExpedicao :new Date(),
       nascimento: new Date() ,
       acreditaSerSupremo :true,
       religiao :'',
       naturalidade :'',
       estado : '',
       nacionalidade :'',
       estadoCivil :'',
       tipoSanguineo:'',
       cep:'', 
       profissao :'',
       endereco :'',
       tempoMoradia:'', 
       numero :'',
       cidade:'', 
       bairro:'', 
       email:'', 
       fone :'',//
       pai:'',
       paiMacom:true, 
       renda: 0, //
       mae:'', 
       dataCadastro:new Date(), 
       dataSindicancia:new Date(), 
       motivos:'', 
       vicios:'', 
       aptidoes:'', 
       contatoEmergencia:'',
       foneEmergencia:'', 
       familiaConcorda:true, 
       statusId:0, 
  
       quemIndica:0
       
  };
  idade = 0;
  @ViewChild('htmlData', { static: false }) htmlData!: ElementRef;
  constructor(
    private usuarioService: AuthService,
    private router: ActivatedRoute
  ) {}
  ngOnInit(): void {
    var id: string = this.router.snapshot.paramMap.get('id') ?? '0';
    var buscaId = id ? id : 0;

    this.usuarioService
      .verCandidato(parseInt(buscaId.toString()))
      .subscribe((data) => {
        this.candidato = data;
        this.idade = this.getAge(this.candidato.nascimento.toString());
      });
  }

  capitalize(texto: string) {
    const finalSentence = texto
      .toLowerCase()
      .replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase());

    return finalSentence;
  }
  getAge(dateString: string) {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }

  public openPDF(): void {
    this.usuarioService
      .baixarFichaCandidato(this.candidato.id, this.idade)
      .subscribe(
        (data) => {
          var content = this.base64ToArrayBuffer(data);
          console.log(data);
          // var blob = new Blob([content], { type: 'document/pdf' });

          //  FileSaver.saveAs(blob,`Ficha Candidato ${this.candidato.nome}.pdf` )

          const linkSource = 'data:application/pdf;base64,' + data;
          const downloadLink = document.createElement('a');
          const fileName = `Ficha Candidato ${this.candidato.nome}.pdf`;

          downloadLink.href = linkSource;
          downloadLink.download = fileName;
          downloadLink.click();
        },
        (error) => {
          console.log(error);
        }
      );
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

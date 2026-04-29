import { FamiliaresInterface } from "./login";

export interface CandidatoInterface{
     id:number,
     nome:string,
     cpf:string, 
     rg:string, 
     dataExpedicao :Date,
     nascimento: Date ,
     acreditaSerSupremo :boolean,
     religiao :string,
     naturalidade :string,
     estado : string,
     nacionalidade :string,
     estadoCivil :string,
     tipoSanguineo:string,
     cep:string, 
     profissao :string,
     endereco :string,
     tempoMoradia:string, 
     numero :string,
     cidade:string, 
     bairro:string, 
     email:string, 
     fone :string,//
      pai:string,
     paiMacom:boolean, 
     renda: number, //
     mae:string, 
     dataCadastro:Date, 
     dataSindicancia?:Date, 
     motivos:string, 
     vicios:string, 
     aptidoes:string, 
     contatoEmergencia:string,
     foneEmergencia:string, 
     familiaConcorda:boolean, 
     statusId:number, 

     quemIndica:number, 
     status?:any,
     familiares?:FamiliaresInterface[],
     documentos?:any[]
}
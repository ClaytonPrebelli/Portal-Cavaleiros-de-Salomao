
import { LojasInterface } from "./lojas"
import { FotoInterface } from './foto';

export interface LoginParams{
    cpf:string,
    pass:string
}

export interface LoginResponse{
  id:number,
    nome: string,
  isCandidato: boolean,
  isAprendiz: boolean,
  isCompanheiro: boolean,
  isMestre: boolean,
  isAdmin: boolean,
  isSuperAdmin:boolean,
  isActive: boolean
  lojaId:number
  titulo:string
  foto:any[]
}
export interface UsuariosInterface{
  id: number,
  nome: string,
  cim: number | null,
  cpf: string,
  rg: string,
  nascimento: Date,
  naturalidade: string,
  estado: string,
  nacionalidade: string,
  estadoCivil: string,
  tipoSanguineo: string,
  cep: string,
  profissao: string,
  endereco:string,
  numero: string,
  cidade: string,
  bairro: string,
  email: string,
  fone: string,
  pai: string,
  mae: string,
  iniciacao: Date,
  elevacao: Date,
  exaltacao: Date,
  observacoes:string ,
  contatoEmergencia: string,
  foneEmergencia: string,
  isCandidato: boolean,
  isAprendiz: boolean,
  isCompanheiro: boolean,
  isMestre: boolean,
  isAdmin: boolean,
  isSuperAdmin: boolean,
  pass: string,
  dataAfiliacao: Date,
  formaAfiliacao: string,
  cargo: string,
  titulo: string,
  statusId: number,
  lojaId: number,
  status?:any,
  loja?:LojasInterface,
  familiares?:FamiliaresInterface[],
  documentos?:[],
  cobrancas?:[]
}
export interface StatusInterface{
  id:number,
  status:string
}
export interface FamiliaresInterface{
  id:number,
  usuarioId:number,
  familiarNome:string,
  nascimentoFamiliar:Date,
  relacao:string,
  usuarioModelsId?:number,
  candidatosModelsId?:number,
  telefone?:string
}
export interface NiverFamiliaInterface{
  nome:string,
  parentesco:string,
  irmao:string,
  data:Date,
  loja:string
}


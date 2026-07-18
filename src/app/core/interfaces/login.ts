
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
  foto:any[]
}

export interface CargoInterface{
  id: number,
  nome: string
}

export interface CobrancaInterface{
  id: number,
  descricao: string,
  ref: string,
  categoriaCobrancaId: number,
  categoriasCobrancas?: any,
  usuarioModelsId: number | null,
  valor: number,
  pago: boolean,
  mesReferencia: string | null,
  statusPagamento: string | null,
  vencimento: Date,
  dataPagamento: Date | null,
  usuario?: any
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
  isMestreInstalado: boolean,
  dataInstalacao: Date | null,
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
  cargo: CargoInterface | null,
  cargoId: number | null,
  statusId: number,
  status?:any,
  familiares?:FamiliaresInterface[],
  documentos?:[],
  cobrancas?:CobrancaInterface[],
  foto?:FotoInterface[]
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


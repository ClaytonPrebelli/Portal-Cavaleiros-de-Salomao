import { FotoInterface } from "./foto";
import { LoginResponse } from "./login";

export interface NoticiasInterface{
    id:number,
    titulo:string,
    texto:string,
    dataPublicacao:Date,
    autorId:number,
    autor?:any,
    fotosNoticias?:any[]
}
export interface NoticiasResponse{
    resultados:number,
    page:number,
    totalPaginas:number,
    noticias:NoticiasInterface[]
}
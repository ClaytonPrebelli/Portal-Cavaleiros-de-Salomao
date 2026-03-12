export interface DocumentosInterface{
    id:number;
    docName:string;
    docFile:any[];
    usuarioId?:number | undefined;
    candidatoId?:number | undefined;
    GrauId?:number | undefined;
    LojaId?:number | undefined;
}
export interface DocumentosResponse{
    link:string,
    nome:string
}
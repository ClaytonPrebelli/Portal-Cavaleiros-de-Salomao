export interface ComunicadoInterface {
    id: number;
    titulo: string;
    texto: string;
    graus: string;
    dataPublicacao: Date;
    autorId: number;
    autor?: any;
    fotosComunicados?: any[];
}

export interface ComunicadoFotoInterface {
    id: number;
    fotoName: string;
    fotoFile: string;
    comunicadoId: number;
}

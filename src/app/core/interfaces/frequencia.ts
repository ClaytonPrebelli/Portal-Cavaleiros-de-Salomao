export interface FrequenciaInterface {
  id: number;
  usuarioModelsId: number;
  dataReuniao: Date | string;
  presente: boolean;
  observacao?: string | null;
  tipoSessao?: string | null;
  usuario?: any;
}

export interface FrequenciaHistoricoInterface {
  usuarioId: number;
  nome: string;
  cargo: string | null;
  totalReunioes: number;
  presencas: number;
  percentual: number;
}

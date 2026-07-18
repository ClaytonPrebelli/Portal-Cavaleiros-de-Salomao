export interface FinanceiroInterface {
  id: number;
  tipo: string;
  categoriaFinanceiroId: number;
  descricao: string;
  valor: number;
  data: Date;
  pago: boolean;
  dataPagamento: Date | null;
  usuarioModelsId: number | null;
  observacao: string;
  categoriaFinanceiro?: any;
  usuario?: any;
}

export interface CategoriaFinanceiroInterface {
  id: number;
  nome: string;
  tipo: string;
}

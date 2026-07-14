export interface Tag {
  id: number;
  name: string;
  idUserCriador: number;
}

export interface Atividade {
  id: number;
  titulo: string;
  realizada: boolean;
  projeto_id: number;
  data_vencimento: string;
  prioridade: string;
  vencido: boolean;
  texto?: string;
  paiId?: number | null;
  tags: Tag[];
  subAtividades: Atividade[];
}

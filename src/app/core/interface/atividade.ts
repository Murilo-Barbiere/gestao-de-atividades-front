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

export enum PrioridadeAtividade {
    URGENTE = "URGENTE",
    ALTA = "ALTA",
    MEDIA = "MEDIA",
    BAIXA = "BAIXA"
}

export enum AtividadeOrdenacao {
    PRIORIDADE = "prioridade",
    DATA_CRIACAO = "dataCriacao",
    DATA_VENCIMENTO = "dataVencimento",
    TITULO = "titulo",
}

export enum StatusFiltro {
    TODAS = "todas",
    PENDENTE = "pendente",
    CONCLUIDA = "concluida",
    VENCIDA = "vencida"
}

export interface AtividadeFiltro {
    idProjeto?: number;
    status?: StatusFiltro;
    sort?: AtividadeOrdenacao;
    prioridade?: PrioridadeAtividade;
    busca?: string;
    order?: "asc" | "desc";
}


import { user } from "./user";

export interface Projeto {
    id: number;
    nome: string;
    participantes: user[];
    numeroDeParticipantes?: number;
}
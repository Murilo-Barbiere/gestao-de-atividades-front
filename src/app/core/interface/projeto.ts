import { User } from "./user";

export interface Projeto {
    id: number;
    nome: string;
    participantes: User[];
    numeroDeParticipantes?: number;
}
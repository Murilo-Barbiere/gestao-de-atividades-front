export interface TokenPayload {
  id: number;
  exp?: number;
  iat?: number;
  nome: string;
  email: string;
}
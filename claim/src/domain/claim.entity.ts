import { Domain } from "./enum";

export type ClaimStatus = 'CREATED' | 'PENDING' | 'REJECTED' | 'RESOLVED';


export class Claim {
  constructor(
    public id: string,
    public name: string,
    public lastname: string,
    public email: string,
    public caseDescription: string,
    public createdAt: string,
    public domain: Domain,
    public tipo: 'Q' | 'R',          // Queja o Reclamo
    public codigoSeguimiento: string // Ej: CP-Q-01
  ) {}
}

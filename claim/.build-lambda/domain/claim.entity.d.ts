import { Domain } from "./enum";
export type ClaimStatus = 'CREATED' | 'PENDING' | 'REJECTED' | 'RESOLVED';
export declare class Claim {
    id: string;
    name: string;
    lastname: string;
    email: string;
    caseDescription: string;
    createdAt: string;
    domain: Domain;
    tipo: 'Q' | 'R';
    codigoSeguimiento: string;
    constructor(id: string, name: string, lastname: string, email: string, caseDescription: string, createdAt: string, domain: Domain, tipo: 'Q' | 'R', codigoSeguimiento: string);
}

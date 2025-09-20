import { Claim } from './claim.entity';
import { Domain } from './enum';


export const IClaimRepositorySymbol = Symbol('IClaimRepository');


export interface IClaimRepository {
save(claim: Claim): Promise<Claim>;
findById(id: string): Promise<Claim | null>;
// Nuevo método
getNextCorrelativo(domain : Domain, tipo : string): Promise<number>;
}
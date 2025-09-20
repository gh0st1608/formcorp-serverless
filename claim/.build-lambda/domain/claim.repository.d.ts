import { Claim } from './claim.entity';
import { Domain } from './enum';
export declare const IClaimRepositorySymbol: unique symbol;
export interface IClaimRepository {
    save(claim: Claim): Promise<Claim>;
    findById(id: string): Promise<Claim | null>;
    getNextCorrelativo(domain: Domain, tipo: string): Promise<number>;
}

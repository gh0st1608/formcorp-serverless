import { IClaimRepository } from '../domain/claim.repository';
import { Claim } from '../domain/claim.entity';
import { Domain } from '../domain/enum';
export declare class DynamoClaimRepository implements IClaimRepository {
    private readonly tableName;
    private readonly counterTable;
    private readonly docClient;
    constructor();
    save(claim: Claim): Promise<Claim>;
    findById(id: string): Promise<Claim | null>;
    getNextCorrelativo(domain: Domain, tipo: 'Q' | 'R'): Promise<number>;
}

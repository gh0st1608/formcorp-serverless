import { IClaimRepository } from '../domain/claim.repository';
import { RequestClaimDto } from './dto/create-claim.dto';
import { IEmailRepository } from './email.repository';
export declare class ClaimApplication {
    private readonly claim;
    private readonly email;
    private readonly domainRecipients;
    constructor(claim: IClaimRepository, email: IEmailRepository);
    save(dto: RequestClaimDto, domain: string): Promise<{
        Data: {
            codigo: string;
            statusCode: number;
            message: string;
        };
    }>;
}

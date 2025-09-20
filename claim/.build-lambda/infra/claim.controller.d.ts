import { RequestClaimDto } from "../application/dto/create-claim.dto";
import { ClaimApplication } from "../application/claim.application";
export declare class ClaimController {
    private readonly createClaim;
    constructor(createClaim: ClaimApplication);
    create(dto: RequestClaimDto, req: Request): Promise<{
        Data: {
            codigo: string;
            statusCode: number;
            message: string;
        };
    }>;
}

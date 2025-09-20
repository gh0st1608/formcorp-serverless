export declare class CreateClaimDTO {
    name: string;
    lastname: string;
    caseDescription: string;
    email: string;
    tipoSolicitud: 'Q' | 'R';
}
export declare class RequestClaimDto {
    Claim: CreateClaimDTO;
}

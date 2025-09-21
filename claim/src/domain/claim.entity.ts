import { Domain } from './enum';

export type ClaimStatus = 'CREATED' | 'PENDING' | 'REJECTED' | 'RESOLVED';

export class Claim {
  constructor(
    public id: string,
    public name: string,
    public lastname: string,
    public email: string,
    public caseDescription: string,
    public domain: Domain,
    public requestType: 'Q' | 'R', // Queja o Reclamo
    public trackingCode: string,  // Ej: CP-Q-000001
    public createdAt: string,

    // Extra fields from DTO
    public authorizeData: boolean,
    public guardianData?: string,
    public contractedGoodDetail?: string,
    public incidentDetail?: string,
    public address?: string,
    public requestDate?: string,
    public underAge?: boolean,
    public documentNumber?: string,
    public orderNumber?: string,
    public providerName?: string,
    public customerOrder?: string,
    public addressReference?: string,
    public phone?: string,
    public contractedGoodType?: string,

    // Lifecycle state
    public status: ClaimStatus = 'CREATED',
  ) {}
}

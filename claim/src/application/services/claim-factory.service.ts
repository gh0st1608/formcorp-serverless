import { v4 as uuidv4 } from 'uuid';
import { Claim } from '../../domain/claim.entity';
import { RequestClaimDTO } from '../dto/create-claim.dto';
import { Domain } from '../../domain/enum';

export class ClaimFactory {
  static create(dto: RequestClaimDTO, domain: Domain, trackingCode: string): Claim {
    const data = dto.Claim;
    const id = uuidv4();
    const now = new Date().toISOString();
    const formattedDate = now.split('T')[0];

    return new Claim(
      id,
      data.firstName,
      data.lastName,
      data.email,
      data.caseDescription,
      domain,
      data.requestType,
      trackingCode,
      formattedDate,
      data.authorizeData,
      data.guardianData,
      data.contractedGoodDetail,
      data.incidentDetail,
      data.address,
      data.requestDate,
      data.underAge,
      data.documentNumber,
      data.orderNumber,
      data.providerName,
      data.customerOrder,
      data.addressReference,
      data.phone,
      data.contractedGoodType,
    );
  }
}

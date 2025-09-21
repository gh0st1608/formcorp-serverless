import { Injectable } from '@nestjs/common';
import { Domain, AliasDomain } from '../../domain/enum';

@Injectable()
export class ClaimCodeService {
  private readonly aliasMap: Record<Domain, string> = {
    [Domain.CARGOCOM_PERU]: AliasDomain.CARGOCOM_PERU,
    [Domain.CARGOCOM_GROUP]: AliasDomain.CARGOCOM_GROUP,
    [Domain.CARGOCOM_CUSTOMS]: AliasDomain.CARGOCOM_CUSTOMS,
  };

  buildTrackingCode(domain: Domain, requestType: string, correlativo: number): string {
    const alias = this.aliasMap[domain];
    return `${alias}-${requestType}-${String(correlativo).padStart(6, '0')}`;
  }
}

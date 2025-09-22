import { Inject, Injectable } from '@nestjs/common';
import { Claim } from '../domain/claim.entity';
import { RequestClaimDTO } from './dto/create-claim.dto';
import { IClaimRepository, IClaimRepositorySymbol } from '../domain/claim.repository';
import { IEmailRepository, IEmailRepositorySymbol } from './email.repository';
import { Domain } from './../domain/enum';
import { ClaimCodeService } from './services/claim-code.service';
import { ClaimEmailService } from './services/claim-email.service';
import { ClaimFactory } from './services/claim-factory.service';
import { DomainMessage } from '../domain/message';

@Injectable()
export class ClaimApplication {
  private readonly domainRecipients: Record<Domain, string> = {
    [Domain.CARGOCOM_PERU]: 'Cargocom@cargocomperu.net',
    [Domain.CARGOCOM_GROUP]: 'Legal@cargocomgroup.com',
    [Domain.CARGOCOM_CUSTOMS]: 'Legal1@cargocomperu.net',
  };

  constructor(
    @Inject(IClaimRepositorySymbol) private readonly claim: IClaimRepository,
    @Inject(IEmailRepositorySymbol) private readonly email: IEmailRepository,
    private readonly claimCodeService: ClaimCodeService,
    private readonly claimEmailService: ClaimEmailService,
  ) {}

  async save(dto: RequestClaimDTO, domain: string) {
    const claimData = dto.Claim;

    // Validar dominio
    const domainKey = Object.values(Domain).find((d) => d === domain);
    if (!domainKey) throw new Error(`No recipient configured for domain ${domain}`);

    // Obtener correlativo
    const correlativo = await this.claim.getNextCorrelativo(domainKey, claimData.requestType);

    // Código de seguimiento
    const trackingCode = this.claimCodeService.buildTrackingCode(domainKey, claimData.requestType, correlativo);

    // Crear entidad con factory
    const claim = ClaimFactory.create(dto, domainKey, trackingCode);

    await this.claim.save(claim);

    // Construcción de correo
    const subject = this.claimEmailService.buildSubject(claimData,trackingCode);
    const body = this.claimEmailService.buildHtmlBody(claimData, trackingCode, claim.createdAt);

    await this.email.sendEmail(this.domainRecipients[domainKey], subject, body);

    return {
      trackingCode,
      statusCode: 200,
      message: claimData.requestType === 'Q' ? DomainMessage.CREATE_COMPLAINT_SUCESS : DomainMessage.CREATE_CLAIM_SUCESS,
    };
  }
}

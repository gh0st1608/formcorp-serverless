import { v4 as uuidv4 } from 'uuid';
import {
  IClaimRepository,
  IClaimRepositorySymbol,
} from '../domain/claim.repository';
import { Claim } from '../domain/claim.entity';
import { RequestClaimDto } from './dto/create-claim.dto';
import { Inject, Injectable } from '@nestjs/common';
import { IEmailRepository, IEmailRepositorySymbol } from './email.repository';
import { AliasDomain, Domain } from './../domain/enum';

@Injectable()
export class ClaimApplication {
  private readonly domainRecipients: Record<Domain, string> = {
    [Domain.CARGOCOM_PERU]: 'erickmga123@gmail.com', //Cargocom@cargocomperu.net
    [Domain.CARGOCOM_GROUP]: 'egalindoa@uni.pe', //Legal@cargocomgroup.com
    [Domain.CARGOCOM_CUSTOMS]: 'Legal1@cargocomperu.net',
  };

  constructor(
    @Inject(IClaimRepositorySymbol)
    private readonly claim: IClaimRepository,
    @Inject(IEmailRepositorySymbol)
    private readonly email: IEmailRepository,
  ) {}

  async save(dto: RequestClaimDto, domain: string) {
    const { name, lastname, email, caseDescription, tipoSolicitud } = dto.Claim;

    // Convertir a enum
    const domainKey = Object.values(Domain).find((d) => d === domain);
    if (!domainKey)
      throw new Error(`No recipient configured for domain ${domain}`);

    const AliasMap: Record<Domain, string> = {
      [Domain.CARGOCOM_PERU]: AliasDomain.CARGOCOM_PERU,
      [Domain.CARGOCOM_GROUP]: AliasDomain.CARGOCOM_GROUP,
      [Domain.CARGOCOM_CUSTOMS]: AliasDomain.CARGOCOM_CUSTOMS,
    };

    const alias = AliasMap[domainKey];

    // Obtener correlativo desde DynamoDB según empresa y tipo
    const correlativo = await this.claim.getNextCorrelativo(
      domainKey,
      tipoSolicitud,
    );

    // Construir código de seguimiento
    const codigoSeguimiento = `${alias}-${tipoSolicitud}-${String(
      correlativo,
    ).padStart(6, '0')}`;

    const id = uuidv4();
    const now = new Date().toISOString();

    const claim = new Claim(
      id,
      name,
      lastname,
      email,
      caseDescription,
      now,
      domainKey as Domain,
      tipoSolicitud,
      codigoSeguimiento,
    );

    const saved = await this.claim.save(claim);

    const recipient = this.domainRecipients[domainKey as Domain];

    const subject = `Nuevo ${
      tipoSolicitud === 'Q' ? 'queja' : 'reclamo'
    } de ${name} ${lastname}`;
    const body = `Caso: ${caseDescription}\nEmail: ${email}\nCódigo: ${codigoSeguimiento}`;

    await this.email.sendEmail(recipient, subject, body);

    return {
      Data: {
        codigo: codigoSeguimiento,
        statusCode: 200,
        message: `Creación de ${tipoSolicitud === 'Q' ? 'queja' : 'reclamo'} exitosa`,
      },
    };
  }
}

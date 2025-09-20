import { Type } from 'class-transformer';
import { IsString, IsEmail, Length, ValidateNested, IsEnum } from 'class-validator';
import { Domain } from '../../domain/enum'; // tu enum de dominios

// DTO principal del formulario
export class CreateClaimDTO {
  @IsString()
  @Length(1, 100)
  name: string;

  @IsString()
  @Length(1, 100)
  lastname: string;

  @IsString()
  @Length(1, 500)
  caseDescription: string;

  @IsEmail()
  email: string;

  @IsEnum(['Q', 'R'])
  tipoSolicitud: 'Q' | 'R'; // Tipo de solicitud: Queja o Reclamo
}

// DTO que envuelve el formulario y opcionalmente el dominio
export class RequestClaimDto {
  @ValidateNested()
  @Type(() => CreateClaimDTO)
  Claim: CreateClaimDTO;
}

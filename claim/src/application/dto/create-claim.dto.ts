import { Type, Expose  } from 'class-transformer';
import {
  IsString,
  IsEmail,
  Length,
  IsBoolean,
  IsOptional,
  IsDateString,
  IsEnum,
  ValidateNested,
} from 'class-validator';

export enum RequestType {
  Q = 'Q', // Complaint (Queja)
  R = 'R', // Claim (Reclamo)
}

export class CreateClaimDTO {
  @Expose({ name: 'nombre' })
  @IsString()
  @Length(1, 100)
  firstName: string;

  @Expose({ name: 'apellidos' })
  @IsString()
  @Length(1, 100)
  lastName: string;

  @Expose({ name: 'correo' })
  @IsEmail()
  email: string;

  @Expose({ name: 'asunto' })
  @IsString()
  @IsOptional()
  caseDescription?: string;

  @Expose({ name: 'autorizaDatos' })
  @IsBoolean()
  authorizeData: boolean;

  @Expose({ name: 'menorEdad' })
  @IsBoolean()
  @IsOptional()
  underAge?: boolean;

  @Expose({ name: 'datosApoderado' })
  @IsString()
  @IsOptional()
  guardianData?: string;

  @Expose({ name: 'detalleBienContratado' })
  @IsString()
  @IsOptional()
  contractedGoodDetail?: string;

  @Expose({ name: 'detalleIncidencia' })
  @IsString()
  @IsOptional()
  incidentDetail?: string;

  @Expose({ name: 'domicilio' })
  @IsString()
  @IsOptional()
  address?: string;

  @Expose({ name: 'fechaSolicitud' })
  @IsDateString()
  @IsOptional()
  requestDate?: string;

  @Expose({ name: 'numeroDocumento' })
  @IsString()
  @IsOptional()
  documentNumber?: string;

  @Expose({ name: 'numeroPedido' })
  @IsString()
  @IsOptional()
  orderNumber?: string;

  @Expose({ name: 'nombreProveedor' })
  @IsString()
  @IsOptional()
  providerName?: string;

  @Expose({ name: 'pedidoCliente' })
  @IsString()
  @IsOptional()
  customerOrder?: string;

  @Expose({ name: 'referenciaDomicilio' })
  @IsString()
  @IsOptional()
  addressReference?: string;

  @Expose({ name: 'telefono' })
  @IsString()
  @IsOptional()
  phone?: string;

  @Expose({ name: 'tipoBienContratado' })
  @IsString()
  @IsOptional()
  contractedGoodType?: string;

  @Expose({ name: 'tipoSolicitud' })
  @IsEnum(RequestType)
  requestType: RequestType;
}

// Wrapper DTO
export class RequestClaimDTO {
  @ValidateNested()
  @Type(() => CreateClaimDTO)
  Claim: CreateClaimDTO;
}

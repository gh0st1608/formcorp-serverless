import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClaimController } from './infra/claim.controller';
import { DynamoClaimRepository } from './infra/dynamo.repository';
import { IClaimRepositorySymbol } from './domain/claim.repository';
import { ClaimApplication } from './application/claim.application';
import { HeadersGuard } from './infra/claim.validator';
import { EmailRepositoryImpl } from './infra/email.repository';
import { IEmailRepositorySymbol } from './application/email.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.env.NODE_ENV || ''}.env`,
      isGlobal: true,
    }),],
  controllers: [ClaimController],
  providers: [
    {
      provide: IClaimRepositorySymbol,
      useClass: DynamoClaimRepository,
    },
    { provide: IEmailRepositorySymbol, useClass: EmailRepositoryImpl },
    HeadersGuard,
    ClaimApplication,
  ],
})
export class AppModule {}

"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClaimApplication = void 0;
const uuid_1 = require("uuid");
const claim_repository_1 = require("../domain/claim.repository");
const claim_entity_1 = require("../domain/claim.entity");
const common_1 = require("@nestjs/common");
const email_repository_1 = require("./email.repository");
const enum_1 = require("./../domain/enum");
let ClaimApplication = class ClaimApplication {
    constructor(claim, email) {
        this.claim = claim;
        this.email = email;
        this.domainRecipients = {
            [enum_1.Domain.CARGOCOM_PERU]: 'erickmga123@gmail.com',
            [enum_1.Domain.CARGOCOM_GROUP]: 'egalindoa@uni.pe',
            [enum_1.Domain.CARGOCOM_CUSTOMS]: 'Legal1@cargocomperu.net',
        };
    }
    async save(dto, domain) {
        const { name, lastname, email, caseDescription, tipoSolicitud } = dto.Claim;
        const domainKey = Object.values(enum_1.Domain).find((d) => d === domain);
        if (!domainKey)
            throw new Error(`No recipient configured for domain ${domain}`);
        const AliasMap = {
            [enum_1.Domain.CARGOCOM_PERU]: enum_1.AliasDomain.CARGOCOM_PERU,
            [enum_1.Domain.CARGOCOM_GROUP]: enum_1.AliasDomain.CARGOCOM_GROUP,
            [enum_1.Domain.CARGOCOM_CUSTOMS]: enum_1.AliasDomain.CARGOCOM_CUSTOMS,
        };
        const alias = AliasMap[domainKey];
        const correlativo = await this.claim.getNextCorrelativo(domainKey, tipoSolicitud);
        const codigoSeguimiento = `${alias}-${tipoSolicitud}-${String(correlativo).padStart(6, '0')}`;
        const id = (0, uuid_1.v4)();
        const now = new Date().toISOString();
        const claim = new claim_entity_1.Claim(id, name, lastname, email, caseDescription, now, domainKey, tipoSolicitud, codigoSeguimiento);
        const saved = await this.claim.save(claim);
        const recipient = this.domainRecipients[domainKey];
        const subject = `Nuevo ${tipoSolicitud === 'Q' ? 'queja' : 'reclamo'} de ${name} ${lastname}`;
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
};
exports.ClaimApplication = ClaimApplication;
exports.ClaimApplication = ClaimApplication = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(claim_repository_1.IClaimRepositorySymbol)),
    __param(1, (0, common_1.Inject)(email_repository_1.IEmailRepositorySymbol)),
    __metadata("design:paramtypes", [Object, Object])
], ClaimApplication);
//# sourceMappingURL=claim.application.js.map
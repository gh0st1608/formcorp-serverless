"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const claim_controller_1 = require("./infra/claim.controller");
const dynamo_repository_1 = require("./infra/dynamo.repository");
const claim_repository_1 = require("./domain/claim.repository");
const claim_application_1 = require("./application/claim.application");
const claim_validator_1 = require("./infra/claim.validator");
const email_repository_1 = require("./infra/email.repository");
const email_repository_2 = require("./application/email.repository");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                envFilePath: `${process.env.NODE_ENV || ''}.env`,
                isGlobal: true,
            }),
        ],
        controllers: [claim_controller_1.ClaimController],
        providers: [
            {
                provide: claim_repository_1.IClaimRepositorySymbol,
                useClass: dynamo_repository_1.DynamoClaimRepository,
            },
            { provide: email_repository_2.IEmailRepositorySymbol, useClass: email_repository_1.EmailRepositoryImpl },
            claim_validator_1.HeadersGuard,
            claim_application_1.ClaimApplication,
        ],
    })
], AppModule);
//# sourceMappingURL=claim.module.js.map
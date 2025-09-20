"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeadersGuard = void 0;
const common_1 = require("@nestjs/common");
const enum_1 = require("../domain/enum");
let HeadersGuard = class HeadersGuard {
    constructor() {
        this.allowedDomains = Object.values(enum_1.Domain);
    }
    canActivate(context) {
        const req = context.switchToHttp().getRequest();
        console.log('req.headers', req.headers);
        const channel = req.headers["channel"] || req.headers["Channel"];
        const apiKey = req.headers["x-api-key"] || req.headers["X-Api-Key"];
        console.log("1");
        if (!channel || !apiKey) {
            throw new common_1.BadRequestException("Missing required headers: channel or x-api-key");
        }
        if (!["APP", "WEB", "OIT"].includes(String(channel))) {
            throw new common_1.BadRequestException("Invalid channel header");
        }
        const domainCandidates = [
            req.headers["x-client-domain"],
            req.headers["x-forwarded-host"],
            req.headers["host"],
        ].filter(Boolean);
        console.log("2");
        const domain = String(domainCandidates[0] || "").trim();
        if (!domain) {
            throw new common_1.BadRequestException("Cannot detect domain from request");
        }
        if (!this.allowedDomains.includes(domain)) {
            throw new common_1.BadRequestException(`Domain not allowed: ${domain}`);
        }
        req.clientDomain = domain;
        return true;
    }
};
exports.HeadersGuard = HeadersGuard;
exports.HeadersGuard = HeadersGuard = __decorate([
    (0, common_1.Injectable)()
], HeadersGuard);
//# sourceMappingURL=claim.validator.js.map
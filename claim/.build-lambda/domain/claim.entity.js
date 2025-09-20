"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Claim = void 0;
class Claim {
    constructor(id, name, lastname, email, caseDescription, createdAt, domain, tipo, codigoSeguimiento) {
        this.id = id;
        this.name = name;
        this.lastname = lastname;
        this.email = email;
        this.caseDescription = caseDescription;
        this.createdAt = createdAt;
        this.domain = domain;
        this.tipo = tipo;
        this.codigoSeguimiento = codigoSeguimiento;
    }
}
exports.Claim = Claim;
//# sourceMappingURL=claim.entity.js.map
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestClaimDto = exports.CreateClaimDTO = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class CreateClaimDTO {
}
exports.CreateClaimDTO = CreateClaimDTO;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 100),
    __metadata("design:type", String)
], CreateClaimDTO.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 100),
    __metadata("design:type", String)
], CreateClaimDTO.prototype, "lastname", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 500),
    __metadata("design:type", String)
], CreateClaimDTO.prototype, "caseDescription", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateClaimDTO.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['Q', 'R']),
    __metadata("design:type", String)
], CreateClaimDTO.prototype, "tipoSolicitud", void 0);
class RequestClaimDto {
}
exports.RequestClaimDto = RequestClaimDto;
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => CreateClaimDTO),
    __metadata("design:type", CreateClaimDTO)
], RequestClaimDto.prototype, "Claim", void 0);
//# sourceMappingURL=create-claim.dto.js.map
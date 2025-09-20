"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var TransformInterceptor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransformInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
let TransformInterceptor = TransformInterceptor_1 = class TransformInterceptor {
    constructor() {
        this.logger = new common_1.Logger(TransformInterceptor_1.name);
    }
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const { method, originalUrl } = request;
        this.logger.log(`[START] ${method} ${originalUrl}`);
        const now = Date.now();
        if (request.body?.Data) {
            request.body = request.body?.Data;
        }
        return next.handle().pipe((0, rxjs_1.map)((data) => {
            const duration = Date.now() - now;
            this.logger.log(`[END] ${method} ${originalUrl} - Duration: ${duration}ms`);
            return {
                Data: data,
            };
        }));
    }
};
exports.TransformInterceptor = TransformInterceptor;
exports.TransformInterceptor = TransformInterceptor = TransformInterceptor_1 = __decorate([
    (0, common_1.Injectable)()
], TransformInterceptor);
//# sourceMappingURL=interceptor.js.map
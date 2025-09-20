"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const claim_module_1 = require("./claim.module");
const core_2 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const interceptor_1 = require("./infra/interceptor");
async function bootstrap() {
    const app = await core_1.NestFactory.create(claim_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        skipMissingProperties: false,
    }));
    app.useGlobalInterceptors(new common_1.ClassSerializerInterceptor(app.get(core_2.Reflector)), new interceptor_1.TransformInterceptor());
    await app.listen(process.env.PORT || 3000);
}
bootstrap();
//# sourceMappingURL=main.js.map
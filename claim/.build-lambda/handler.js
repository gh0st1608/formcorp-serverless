"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const aws_serverless_express_1 = require("aws-serverless-express");
const core_1 = require("@nestjs/core");
const platform_express_1 = require("@nestjs/platform-express");
const express_1 = __importDefault(require("express"));
const claim_module_1 = require("./claim.module");
let cachedServer;
async function bootstrapServer() {
    const server = (0, express_1.default)();
    const app = await core_1.NestFactory.create(claim_module_1.AppModule, new platform_express_1.ExpressAdapter(server));
    app.enableShutdownHooks();
    await app.init();
    return (0, aws_serverless_express_1.createServer)(server);
}
const handler = async (event, context) => {
    if (!cachedServer) {
        cachedServer = await bootstrapServer();
    }
    return (0, aws_serverless_express_1.proxy)(cachedServer, event, context, "PROMISE").promise;
};
exports.handler = handler;
//# sourceMappingURL=handler.js.map
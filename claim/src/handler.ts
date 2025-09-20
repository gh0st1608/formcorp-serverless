import { Handler } from "aws-lambda";
import { createServer, proxy } from "aws-serverless-express";
import { NestFactory } from "@nestjs/core";
import { ExpressAdapter } from "@nestjs/platform-express";
import express from "express";
import { AppModule } from "./claim.module";
import { setupApp } from "./setup";

let cachedServer: any;

async function bootstrapServer() {
  const server = express();

  // Parsear JSON del body de API Gateway
  server.use(express.json());

  const app = await NestFactory.create(AppModule, new ExpressAdapter(server), {
    logger: console,
  });

  await setupApp(app); // ✅ Aplica pipes e interceptors, incluyendo tu TransformInterceptor

  app.enableShutdownHooks();
  await app.init();

  return createServer(server);
}

export const handler: Handler = async (event, context) => {
  if (!cachedServer) {
    cachedServer = await bootstrapServer();
  }
  return proxy(cachedServer, event, context, "PROMISE").promise;
};

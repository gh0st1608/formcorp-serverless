import { Handler } from "aws-lambda";
import { createServer, proxy } from "aws-serverless-express";
import { NestFactory } from "@nestjs/core";
import { ExpressAdapter } from "@nestjs/platform-express";
import express from "express";
import { AppModule } from "./claim.module";

let cachedServer: any;

async function bootstrapServer() {
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
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

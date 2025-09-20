import { Handler } from "aws-lambda";
import { createServer, proxy } from "aws-serverless-express";
import { NestFactory, Reflector } from "@nestjs/core";
import { ExpressAdapter } from "@nestjs/platform-express";
import express from "express";
import { AppModule } from "./claim.module";
import { setupApp } from "./setup";

let cachedServer: any;

async function bootstrapServer() {
  const server = express();

  // Middleware para parsear JSON
  server.use(express.json());

  // Middleware para adaptar body de API Gateway
  server.use((req, res, next) => {
    if (req.body?.Data?.Claim) {
      req.body = req.body.Data.Claim;
    }
    next();
  });

  const app = await NestFactory.create(AppModule, new ExpressAdapter(server), {
    logger: console,
  });

  await setupApp(app); // aplica pipes e interceptors

  app.enableShutdownHooks();
  await app.init();

  return createServer(server);
}

  export const handler: Handler = async (event, context) => {
    try {
      if (!cachedServer) {
        cachedServer = await bootstrapServer();
      }
      return proxy(cachedServer, event, context, "PROMISE").promise;
    } catch (err) {
      console.error("Error en Lambda:", err);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Error interno en Lambda", error: err.message }),
      };
    }
  };

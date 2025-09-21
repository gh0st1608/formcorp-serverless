import { INestApplication, ValidationPipe, ClassSerializerInterceptor } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { TransformInterceptor } from "./infra/interceptor";

export async function setupApp(app: INestApplication) {
  // Pipes globales
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      skipMissingProperties: false,
    })
  );

  // Interceptors globales
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
    new TransformInterceptor()
  );

  app.enableCors({
  origin: [
    "https://dev.solutionserj.com",
    "https://test.solutionserj.com",
    "https://prod.solutionserj.com",
    "https://forms.cargocomgroup.com",
    "https://forms.cargocomperu.net",
    "https://forms.cargocomcustoms.com"
  ],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-client-domain"], // ✅ agregado
  credentials: false,
});


  // Aquí podrías agregar middlewares globales si los necesitas
  // app.use(someMiddleware);

  return app;
}
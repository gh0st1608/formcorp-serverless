import { NestFactory } from "@nestjs/core";
import { AppModule } from "./claim.module";
import { setupApp } from "./setup";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await setupApp(app); // aplica pipes, interceptors, etc.

  await app.listen(process.env.PORT || 3000);
}

bootstrap();
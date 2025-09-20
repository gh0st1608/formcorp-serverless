import { NestFactory } from "@nestjs/core";
import { AppModule } from "./claim.module";
import { Reflector } from "@nestjs/core";
import { ClassSerializerInterceptor, ValidationPipe } from "@nestjs/common";
import { TransformInterceptor } from "./infra/interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      skipMissingProperties: false,
    })
  );

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
    new TransformInterceptor()
  );
  
  await app.listen(process.env.PORT || 3000);
  /* app.useGlobalFilters(new HttpErrorFilter()); */
}
bootstrap();

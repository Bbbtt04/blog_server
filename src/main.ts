import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { Logger, ValidationPipe } from '@nestjs/common';
import { generateDocument } from './utils/generateDocument';
import { HttpExceptionFilter } from './exceptions/http.exception.filter';
import { AllExceptionsFilter } from './exceptions/base.exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter(), new HttpExceptionFilter());

  generateDocument(app);

  await app.listen(3000, () => {
    Logger.log(`服务已经启动,接口请访问:http://localhost:3000/api/doc`);
  });
}
bootstrap();

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as packageConfig from '../../package.json';

export function generateDocument(app) {
  const options = new DocumentBuilder()
    .setTitle(packageConfig.name)
    .setVersion(packageConfig.description)
    .setDescription(packageConfig.description)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/api/doc', app, document);
}

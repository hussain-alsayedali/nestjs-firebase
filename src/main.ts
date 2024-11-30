import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';

export async function createApp() {
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  app.enableCors();
  await app.init();
  return server;
}

// For local development
if (require.main === module) {
  createApp().then((server) => {
    const port = process.env.PORT || 3000;
    server.listen(port, () => {
      console.log(`NestJS server running on http://localhost:${port}`);
    });
  });
}

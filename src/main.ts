import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import * as functions from 'firebase-functions';

const server = express();

const createNestServer = async (expressInstance) => {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
  );
  await app.init();
};

createNestServer(server).then(() => {
  if (!process.env.FUNCTIONS_EMULATOR && !process.env.FUNCTION_NAME) {
    // Running locally
    const port = process.env.PORT || 3000;
    server.listen(port, () => {
      console.log(`NestJS server running on http://localhost:${port}`);
    });
  }
});

export const api = functions.https.onRequest(server);

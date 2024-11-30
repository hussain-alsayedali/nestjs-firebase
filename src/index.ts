// src/index.ts
import * as functions from 'firebase-functions';
import { setGlobalOptions } from 'firebase-functions/v2';
import { createApp } from './main';

setGlobalOptions({ region: 'me-central1' });
export const api = functions.https.onRequest(async (request, response) => {
  const app = await createApp();
  app(request, response);
});

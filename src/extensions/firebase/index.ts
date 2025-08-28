'use strict';

import admin from 'firebase-admin';

let firebaseAdmin: admin.app.App;

export default ({ strapi }: { strapi: any }) => {
  try {
    // Controlla se le variabili d'ambiente sono disponibili
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (projectId && clientEmail && privateKey) {
      // Inizializza Firebase con le variabili d'ambiente
      if (!admin.apps.length) {
        firebaseAdmin = admin.initializeApp({
          credential: admin.credential.cert({
            projectId: projectId,
            clientEmail: clientEmail,
            privateKey: privateKey.replace(/\\n/g, '\n')
          })
        });
      } else {
        firebaseAdmin = admin.app();
      }
      
      strapi.firebase = firebaseAdmin;
      strapi.log.info('Firebase Admin SDK initialized successfully from environment variables');
    } else {
      strapi.log.warn('Firebase environment variables not found. Firebase Admin SDK not initialized.');
    }
  } catch (error) {
    strapi.log.error('Failed to initialize Firebase Admin SDK:', error);
  }
};
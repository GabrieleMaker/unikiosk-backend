'use strict';

import admin from 'firebase-admin';
import serviceAccount from '../../../config/firebase-service-account.json';

let firebaseAdmin: admin.app.App;

export default ({ strapi }: { strapi: any }) => {
  try {
    if (!admin.apps.length) {
      firebaseAdmin = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
      });
    } else {
      firebaseAdmin = admin.app();
    }
    
    strapi.firebase = firebaseAdmin;
    strapi.log.info('Firebase Admin SDK initialized successfully');
  } catch (error) {
    strapi.log.error('Failed to initialize Firebase Admin SDK:', error);
  }
};
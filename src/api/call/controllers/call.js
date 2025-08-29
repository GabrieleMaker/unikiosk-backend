'use strict';

const admin = require('firebase-admin');

// --- CONFIGURAZIONE PER RENDER ---
// Il file JSON con la chiave privata viene ora letto come una stringa
// dalla variabile d'ambiente 'FIREBASE_SERVICE_ACCOUNT_JSON' e poi convertito in un oggetto JSON.
if (!admin.apps.length) {
  try {
    let serviceAccount;
    if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
      // Metodo per la PRODUZIONE (Render)
      // Legge la variabile d'ambiente, che è una stringa, e la converte in un oggetto JSON
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
      console.info('Firebase Admin SDK: Initializing with environment variable.');
    } else {
      // Metodo per lo SVILUPPO LOCALE
      // Cerca il file fisico nella cartella 'config'
      serviceAccount = require('../../../config/firebase-service-account.json');
      console.info('Firebase Admin SDK: Initializing with local file.');
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.info('Firebase Admin SDK initialized successfully.');

  } catch (error) {
    // Se entrambi i metodi falliscono, mostra un errore critico
    console.error('CRITICAL: Firebase Admin SDK initialization failed.', error.message);
  }
}
// --- FINE CONFIGURAZIONE ---

module.exports = {
  async startCall(ctx) {
    // La logica interna rimane la stessa
    const { callerId } = ctx.request.body;

    if (!callerId) {
      return ctx.badRequest('Missing required field: callerId');
    }

    try {
      // 1. Trova il token FCM del dispositivo della Portineria nel database di Strapi.
      const portineriaDevice = await strapi.db.query('api::device.device').findOne({
        where: { deviceName: 'Portineria' },
      });

      if (!portineriaDevice || !portineriaDevice.fcmToken) {
        console.warn('Call attempt failed: Portineria device not found or FCM token is missing.');
        return ctx.notFound('Portineria device not found or not registered.');
      }

      const fcmToken = portineriaDevice.fcmToken;

      // 2. Prepara il messaggio di notifica push.
      // Genera un nome di canale unico per questa chiamata specifica.
      const channelName = `CALL_${Date.now()}`;
      
      const message = {
        // 'data' è il payload di dati personalizzati che la nostra app Android leggerà.
        data: {
          callerId: callerId,
          channelName: channelName,
        },
        // 'token' specifica l'indirizzo esatto del dispositivo a cui inviare la notifica.
        token: fcmToken,
      };

      // 3. Invia la notifica tramite i server di Firebase.
      console.log(`Sending call notification to Portineria device (FCM Token: ...${fcmToken.slice(-10)}) for caller: ${callerId}`);
      await admin.messaging().send(message);
      console.log('Notification sent successfully.');

      // 4. Invia una risposta al dispositivo Campus che ha iniziato la chiamata.
      // Restituire il channelName è fondamentale, così il Campus sa in quale "stanza" Agora mettersi in attesa.
      return ctx.send({
        message: 'Call notification sent successfully.',
        channelName: channelName,
      });

    } catch (error) {
      console.error('Error in start-call controller:', error);
      // Controlla se l'errore proviene da Firebase (es. token non valido)
      if (error.code && error.code.startsWith('messaging/')) {
        return ctx.internalServerError('Failed to send notification via Firebase.', { errorDetails: error.message });
      }
      return ctx.internalServerError('An internal error occurred while starting the call.');
    }
  },
};
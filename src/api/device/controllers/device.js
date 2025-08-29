'use strict';

/**
 * Controller personalizzato per la registrazione dei dispositivi.
 */

module.exports = {
  /**
   * Gestisce la registrazione o l'aggiornamento di un dispositivo.
   * Cerca un dispositivo tramite deviceName. Se esiste, aggiorna il suo fcmToken.
   * Se non esiste, ne crea uno nuovo.
   * @param {object} ctx - Il contesto della richiesta di Koa/Strapi.
   */
  async register(ctx) {
    // 1. Estrai i dati dal corpo della richiesta inviata dall'app Android.
    const { deviceName, fcmToken, deviceType } = ctx.request.body;

    // 2. Valida che tutti i campi necessari siano presenti.
    if (!deviceName || !fcmToken || !deviceType) {
      return ctx.badRequest('Missing required fields: deviceName, fcmToken, deviceType');
    }

    try {
      // 3. Cerca nel database se un dispositivo con questo nome esiste già.
      const existingDevice = await strapi.db.query('api::device.device').findOne({
        where: { deviceName: deviceName },
      });

      if (existingDevice) {
        // 4a. Se il dispositivo esiste, aggiorna solo il suo fcmToken.
        // Questo è utile se l'app viene reinstallata e Firebase genera un nuovo token.
        await strapi.entityService.update('api::device.device', existingDevice.id, {
          data: { fcmToken: fcmToken },
        });
        console.log(`Updated token for existing device: ${deviceName}`);
        return ctx.send({ message: 'Device token updated successfully' });
      } else {
        // 4b. Se il dispositivo non esiste, ne crea uno nuovo nel database.
        await strapi.entityService.create('api::device.device', {
          data: {
            deviceName: deviceName,
            fcmToken: fcmToken,
            deviceType: deviceType,
            publishedAt: new Date(), // Assicura che la nuova entry sia subito "pubblicata".
          },
        });
        console.log(`Registered new device: ${deviceName}`);
        return ctx.send({ message: 'Device registered successfully' });
      }
    } catch (error) {
      // 5. In caso di errore del database o altro, logga l'errore e invia una risposta generica.
      console.error('Error in device registration controller:', error);
      return ctx.internalServerError('An error occurred during device registration.');
    }
  },
};
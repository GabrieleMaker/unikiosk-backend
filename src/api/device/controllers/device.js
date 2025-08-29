'use strict';

/**

    Controller personalizzato per la gestione dei dispositivi
    */

module.exports = {
/**

    Gestisce la registrazione o l'aggiornamento di un dispositivo.

    @param {object} ctx - Il contesto della richiesta di Koa/Strapi.
    */
    async registerDevice(ctx) {
    // 1. Estrae i dati dal corpo della richiesta inviata dall'app Android.
    const { deviceName, fcmToken, deviceType } = ctx.request.body;

    // 2. Valida che tutti i campi necessari siano presenti.

    if (!deviceName || !fcmToken || !deviceType) {
      return ctx.badRequest('Missing required fields: deviceName, fcmToken, deviceType');
    }

    try {
    // 3. Cerca nel database se esiste già un dispositivo con lo stesso nome.
    // 'api::device.device' è il modo in cui Strapi identifica la collection 'Device'.
    const existingDevice = await strapi.db.query('api::device.device').findOne({
    where: { deviceName: deviceName },
    });
    
    if (existingDevice) {
    // 4a. Se il dispositivo esiste già, aggiorna solo il suo fcmToken.
    // Questo è utile se l'app viene reinstallata e Firebase genera un nuovo token.
    await strapi.entityService.update('api::device.device', existingDevice.id, {
      data: { fcmToken: fcmToken },
    });
    
    console.log(`[Device Register] Token aggiornato per il dispositivo: ${deviceName}`);
    return ctx.send({ message: 'Device token updated successfully' });

    } else {
    // 4b. Se il dispositivo non esiste, ne crea uno nuovo.
    await strapi.entityService.create('api::device.device', {
      data: {
        deviceName: deviceName,
        fcmToken: fcmToken,
        deviceType: deviceType,
        publishedAt: new Date(), // Pubblica subito la nuova entry per renderla visibile.
      },
    });

    console.log(`[Device Register] Nuovo dispositivo registrato: ${deviceName}`);
    return ctx.send({ message: 'Device registered successfully' });
  }
} catch (error) {
  // 5. In caso di errore del database o altro, invia una risposta di errore generica.
  console.error('[Device Register] Errore durante la registrazione del dispositivo:', error);
  return ctx.internalServerError('An error occurred during device registration.');
  }
  },
};
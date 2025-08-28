'use strict';

module.exports = {
  async register(ctx) {
    const { deviceName, fcmToken, deviceType } = ctx.request.body;

    if (!deviceName || !fcmToken || !deviceType) {
      return ctx.badRequest('Missing required fields: deviceName, fcmToken, deviceType');
    }

    try {
      // Cerca se un dispositivo con questo nome esiste già
      const existingDevice = await strapi.db.query('api::device.device').findOne({
        where: { deviceName: deviceName },
      });

      if (existingDevice) {
        // Se esiste, aggiorna il suo fcmToken
        await strapi.entityService.update('api::device.device', existingDevice.id, {
          data: { fcmToken: fcmToken },
        });
        console.log(`Updated token for device: ${deviceName}`);
        return ctx.send({ message: 'Device token updated successfully' });
      } else {
        // Se non esiste, creane uno nuovo
        await strapi.entityService.create('api::device.device', {
          data: {
            deviceName: deviceName,
            fcmToken: fcmToken,
            deviceType: deviceType,
            publishedAt: new Date(), // Pubblica subito la nuova entry
          },
        });
        console.log(`Registered new device: ${deviceName}`);
        return ctx.send({ message: 'Device registered successfully' });
      }
    } catch (error) {
      console.error('Error in device registration:', error);
      return ctx.internalServerError('An error occurred during device registration.');
    }
  },
};
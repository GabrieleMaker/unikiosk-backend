'use strict';

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/devices/register', // Usiamo un path strutturato: /api/devices/register
      handler: 'device.registerDevice', // Usiamo un nome di funzione personalizzato
      config: {
        auth: false,
      },
    },
  ],
};
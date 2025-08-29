'use strict';

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/devices/register', // Un percorso più standard: /api/devices/register
      handler: 'device.registerDevice', // Il nome della nuova funzione nel controller
      config: {
        auth: false,
      },
    },
  ],
};
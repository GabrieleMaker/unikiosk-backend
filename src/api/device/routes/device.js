'use strict';

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/register-device',
      handler: 'device.register',
      config: {
        // Permetti l'accesso pubblico a questo endpoint
        auth: false,
      },
    },
  ],
};
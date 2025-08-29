'use strict';

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/calls/start', // Path strutturato: /api/calls/start
      handler: 'call.startCall', // Nome di funzione personalizzato
      config: {
        auth: false,
      },
    },
  ],
};
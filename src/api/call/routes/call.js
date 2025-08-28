'use strict';

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/start-call',
      handler: 'call.start',
      config: {
        auth: false,
      },
    },
  ],
};
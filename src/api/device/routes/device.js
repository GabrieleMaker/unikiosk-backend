'use strict';

module.exports = {
  routes: [
    {
      method: 'POST', // Specifica che accettiamo il metodo POST
      path: '/register-device', // Il percorso della nostra API
      handler: 'device.register', // La funzione nel controller da eseguire
      config: {
        auth: false, // Non richiede autenticazione
      },
    },
  ],
};
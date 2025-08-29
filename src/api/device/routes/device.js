'use strict';

/**
 * Rotta personalizzata per l'endpoint di registrazione del dispositivo.
 */

module.exports = {
  routes: [
    {
      /**
       * Metodo HTTP accettato per questa rotta. Deve essere POST perché l'app invia dati.
       */
      method: 'POST',

      /**
       * Il percorso URL che l'app Android chiamerà.
       */
      path: '/register-device',

      /**
       * Specifica quale funzione del controller deve essere eseguita.
       * 'device.register' significa: usa il controller 'device' e la sua funzione 'register'.
       */
      handler: 'device.register',

      /**
       * Configurazione della rotta.
       */
      config: {
        /**
         * 'auth: false' rende questo endpoint pubblico.
         * È fondamentale, altrimenti l'app Android (che non è un utente loggato)
         * riceverebbe un errore "403 Forbidden".
         */
        auth: false,
      },
    },
  ],
};
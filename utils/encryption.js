const sodium = require('libsodium-wrappers');

module.exports = {
  encryptMessage: (message, nonce, key) => {
    return sodium.crypto_secretbox_easy(message, nonce, key);
  },
  decryptMessage: (ciphertext, nonce, key) => {
    return sodium.crypto_secretbox_open_easy(ciphertext, nonce, key);
  }
};

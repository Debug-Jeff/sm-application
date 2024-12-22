import sodium from 'libsodium-wrappers';

export const encryptMessage = (message, key) => {
  const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);
  const encryptedMessage = sodium.crypto_secretbox_easy(message, nonce, key);
  return { encryptedMessage, nonce };
};

export const decryptMessage = (encryptedMessage, nonce, key) => {
  const decryptedMessage = sodium.crypto_secretbox_open_easy(encryptedMessage, nonce, key);
  return decryptedMessage;
};

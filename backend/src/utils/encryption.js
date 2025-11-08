const CryptoJS = require('crypto-js');

// CRITICAL: Encryption key must be set via environment variable
// Minimum 32 characters recommended for AES-256
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

if (!ENCRYPTION_KEY) {
  throw new Error(
    'ENCRYPTION_KEY environment variable is required. ' +
    'Set a strong random key (minimum 32 characters) in your .env file.'
  );
}

if (ENCRYPTION_KEY.length < 32) {
  throw new Error(
    'ENCRYPTION_KEY must be at least 32 characters long for security. ' +
    'Current length: ' + ENCRYPTION_KEY.length
  );
}

/**
 * Encrypt a string
 * @param {string} text - Text to encrypt
 * @returns {string} Encrypted text
 */
const encrypt = (text) => {
  if (!text) return text;
  try {
    return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
};

/**
 * Decrypt a string
 * @param {string} encryptedText - Text to decrypt
 * @returns {string} Decrypted text
 */
const decrypt = (encryptedText) => {
  if (!encryptedText) return encryptedText;
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedText, ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
};

module.exports = { encrypt, decrypt };

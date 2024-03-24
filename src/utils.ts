import * as crypto from 'crypto';    // this is necessary for some version of nodejs without crypto module

type TNCRYPT_ENC = 'base64' | 'binary' | 'hex' | 'ucs-2' | 'ucs2' | 'utf16le';

/**
 * algorithm used for encoding message
 */
const algorithm = 'aes-256-cbc';

/**
 * crypto random initial vector generated from core node {crypto} module
 */
const initialVector: Buffer = crypto.randomBytes(16);

/**
 * crypto random key generated from core node {crypto} module
 * {note}: please read the value for KEY from your app's environment
 */
const _enc = (process.env.NCRYPT_ENC) as TNCRYPT_ENC || 'hex';
const _key = process.env.KEY || 'please provide a KEY in your .env file or config';
const key: Buffer = crypto.scryptSync(_key, 'salt', 32);

/**
 * @param {size.<number>} size
 * @param {enc.<string>} enc
 * @returns {*.<string>} string
 */
export function randomString(size: number, enc: 'base64' | 'hex' = 'base64'): string {
  return crypto.randomBytes(size || 64).toString(enc);
}

/**
 * intermediate data encoder function
 * @param {string.<any>} text
 * @param secret
 * @returns {string} encrypted or cipher text
 */
export function encode(text: string): string {
  let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), initialVector);
  let encrypted = cipher.update(text);

  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return `${initialVector.toString(_enc)}.${encrypted.toString(_enc)}`;
}

/**
 * intermediate data decoder function
 * @param {string.<any>} text
 * @returns {string.<string>} decrypted data
 */
export function decode(text: string): string {
  if (typeof text !== 'string') {
    throw new TypeError('argument must be a string, or a string-like object');
  }

  const iv = text.split('.')[0];
  const encryptedData = text.split('.')[1];

  let _iv = Buffer.from(iv, _enc);
  let encryptedText = Buffer.from(encryptedData, _enc);
  let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), _iv);
  let decrypted = decipher.update(encryptedText);

  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}
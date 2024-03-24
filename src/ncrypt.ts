import { encode, decode, randomString } from './utils';

/**
 * @class Ncrypt
 * @type {Ncrypt.<object>}
 */
export default class Ncrypt {
  /**
   * encryption secret.
   * @type {secret.<string>} secret
   */
  private secret: string;

  /**
   * object constructor
   * @param {secret.<string>} secret
   */
  constructor(secret: string) {
    this.secret = secret;

    // bind public instnace methods
    this.encrypt = this.encrypt.bind(this);
    this.decrypt = this.decrypt.bind(this);
  }

  /**
   * convert all entered text to decimal equivalent character codes
   * @param {text.<string>} text to be converted
   * @return {Array.<number>} array of character codes
   */
  private convertTextToDecimal = (text: string): number[] => {
    return text.split('').map((value) => value.charCodeAt(0));
  }

  /**
   * encode provided secret on decimal character codes
   * @param {charCode.<number, number[]>} charCodes
   * @returns {*.<number>} decimal string
   */
  private applySecretToCharacters = (charCodes: number | number[]): number => {
    return this.convertTextToDecimal(this.secret)
      .reduce((firstValue: number, secondValue: number) => (firstValue ^ secondValue), charCodes as number)
  }

  /**
   * convert character bytes to hexadecimal equivalent
   * @param {number.<number>} number
   * @returns {*.<string>} hexadecimal string
   */
  private convertByteToHexadecimal = (number: number): string => {
    return ('0' + Number(number).toString(16)).substr(-2);
  }

  /**
   * generate random strings
   * @example
   *
   * var fs = require('fs');
   * var ncrypt = require('ncrypt-js');
   *
   * console.log(ncrypt.randomString(8, 'base64')); // g3lzZ48TW6w==
   *
   * @param {size.<number>} size
   * @param {enc.<string>} enc
   * @returns {*.<string>} string
   */
  public static randomString(size?: number, enc?: 'hex' | 'base64'): string {
    return randomString(size, enc);
  }

  /**
   * data to be encrypted
   * @param {data.<stirng>} data
   * @returns {*.<string>} encrypted text
   */
  public encrypt(data: string | number | boolean | object): string {
    /**
     * this does the actual processing return a string
     * resulting from charCode conversion, salting and
     * hexadecimal mapping
     */
    try {
      const encodedMessage = JSON.stringify(data).split('')
        .map(this.convertTextToDecimal)
        .map(this.applySecretToCharacters)
        .map(this.convertByteToHexadecimal)
        .join('');

      return encode(encodedMessage);
    } catch (e) {
      throw new Error('invalid data was entered, enter data of type object, number, string or boolean to be encrypted.' + e);
    }
  }

  /**
   * text be decrypted
   * @param {text.<stirng>} text
   * @returns {*.<string>} decrypted data
   */
  public decrypt(text: string): string | number | boolean | object {
    const encodeData = decode(text);

    const data = (encodeData).match(/.{1,2}/g)
      .map((hex: string) => parseInt(hex, 16))
      .map(this.applySecretToCharacters)
      .map((charCode: number | number[]) => String.fromCharCode(charCode as number))
      .join('');

    return JSON.parse(data);
  }
}
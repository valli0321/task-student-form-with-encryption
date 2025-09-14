import CryptoJS from 'crypto-js';

const FRONTEND_KEY = 'b144cb13304a3745accaa0962d2a4fdd43e29d64cfb387132fe94b8209c1c691';
const FIXED_IV = CryptoJS.enc.Hex.parse('1234567890abcdef1234567890abcdef');

export function encryptData(plainText: string): string {
  return CryptoJS.AES.encrypt(plainText, FRONTEND_KEY).toString();
}

export function decryptData(encryptedText: string): string {
  const bytes = CryptoJS.AES.decrypt(encryptedText, FRONTEND_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}

export function encryptPassword(plainText: string): string {
  const encrypted = CryptoJS.AES.encrypt(
    CryptoJS.enc.Utf8.parse(plainText),
    CryptoJS.enc.Utf8.parse(FRONTEND_KEY),
    { iv: FIXED_IV, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
  );
  return encrypted.toString();
}
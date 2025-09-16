import * as crypto from 'crypto';
import bcrypt from 'bcrypt';

const BACKEND_KEY = Buffer.from(process.env.BACKEND_SECRET_KEY!, 'hex'); // using directly here for now
const ALGORITHM = 'aes-256-cbc';

export function encryptData(plainText: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, BACKEND_KEY, iv);
  let encrypted = cipher.update(plainText, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return `${iv.toString('hex')}:${encrypted}`;
}

export function decryptData(encryptedText: string): string {
  const [ivHex, encryptedHex] = encryptedText.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, BACKEND_KEY, iv);
  let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

export async function hashPassword(encryptedPassword: string): Promise<string> {
  return bcrypt.hash(encryptedPassword, 10);
}

export async function comparePassword(encryptedInput: string, storedHash: string): Promise<boolean> {
  return bcrypt.compare(encryptedInput, storedHash);
}
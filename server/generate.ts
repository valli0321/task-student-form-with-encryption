import * as crypto from 'crypto';

console.log('Frontend key:', crypto.randomBytes(32).toString('base64'));
console.log('Backend key:', crypto.randomBytes(32).toString('base64'));

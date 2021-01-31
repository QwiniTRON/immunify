import bcrypt from 'bcryptjs';

export const GeneratePassword = (pass: string): Promise<string> =>
  new Promise((resolve) => {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(pass, salt, (err, result) => resolve(result))
    })
  });



const hashKey = +(process.env as any).REACT_APP_PERSONALITY_SECRET_KEY;
const delimiter = '`';

function decodeByKey(str: string) {
  return str
    .split('')
    .map(char => (char.charCodeAt(0)! ^ hashKey) + delimiter)
    .join('');
}

function encodeByKey(str: string) {
  return str
    .split(delimiter)
    .slice(0, -1)
    .map(value => +value ^ hashKey)
    .map(char => String.fromCodePoint(char))
    .join('');
}

export function decodeUserPersonality(personality: string) {
  return window.btoa(decodeByKey(personality));
}

export function encodeUserPersonality(personality: string) {
  return encodeByKey(window.atob(personality));
}
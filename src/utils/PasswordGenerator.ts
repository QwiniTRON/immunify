import bcrypt from 'bcryptjs';

export const GeneratePassword = (pass: string): Promise<string> =>
  new Promise((resolve) => {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(pass, salt, (err, result) => resolve(result)) 
    })
  });

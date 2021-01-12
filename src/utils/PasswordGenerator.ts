import bcrypt from 'bcryptjs';

export const GeneratePassword = (pass: string): Promise<string> =>
  new Promise((resolve) => {
    bcrypt.hash(pass, "somesalt", (err, result) => resolve(result)) 
  });

import crypto from 'crypto';

export const generateId = (): string => {
  const id = crypto.randomBytes(16).toString('hex');
  return id;
};

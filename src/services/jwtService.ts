import jwt,  { type JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export const signToken = (userId: string) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });
};

export const verifyToken = (token: string) => {
  const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

  // Ensure the decoded payload contains userId
  if (typeof decoded === 'object' && 'userId' in decoded) {
    return decoded as { userId: string }; // Return expected payload type
  }

  throw new Error('Invalid token payload');
};

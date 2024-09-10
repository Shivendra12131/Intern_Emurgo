import type { FastifyReply, FastifyRequest } from 'fastify';
import { verifyToken } from '../services/jwtService';

export const authMiddleware = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const token = request.headers.authorization?.split(' ')[1]; // Extract Bearer token
    if (!token) {
      return reply.code(401).send({ error: 'Token missing' });
    }

    const decoded = verifyToken(token); // Verify token

    // Attach the userId to request.user
    request.user = {
      userId: decoded.userId
    };
  } catch (err) {
    return reply.code(401).send({ error: 'Invalid token' });
  }
};

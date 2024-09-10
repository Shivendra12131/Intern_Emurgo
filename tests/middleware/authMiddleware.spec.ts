import Fastify from 'fastify';
import { authMiddleware } from '../../src/middleware/authMiddleware';
import { signToken } from '../../src/services/jwtService';

const fastify = Fastify();

fastify.addHook('preHandler', authMiddleware);

describe('Auth Middleware Tests', () => {
  test('Valid Token', async () => {
    const token = signToken(1); // Sign a token for a user with id 1

    const response = await fastify.inject({
      method: 'GET',
      url: '/',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.statusCode).toBe(200);
  });

  test('Invalid Token', async () => {
    const response = await fastify.inject({
      method: 'GET',
      url: '/',
      headers: {
        Authorization: 'Bearer invalidtoken',
      },
    });

    expect(response.statusCode).toBe(401);
  });
});
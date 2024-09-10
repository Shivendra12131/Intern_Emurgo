// import { FastifyInstance } from 'fastify';
import type { FastifyInstance } from 'fastify';
import { createUser, authenticateUser } from '../controllers/userController';

export default async function userRoutes(fastify: FastifyInstance) {
  fastify.post('/users', createUser);
  fastify.post('/users/authenticate', authenticateUser);
}
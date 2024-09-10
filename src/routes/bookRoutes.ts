import type { FastifyInstance } from 'fastify';
import { createBook, attachBookToUser } from '../controllers/bookController';
import { authMiddleware } from '../middleware/authMiddleware';

export default async function bookRoutes(fastify: FastifyInstance) {
  fastify.post('/books', { preHandler: [authMiddleware] }, createBook);
  fastify.post('/users/:userId/books/:bookId', { preHandler: [authMiddleware] }, attachBookToUser);
}
import { photosRouter } from '@/server/api/routers/photos';
import { todoRouter } from '@/server/api/routers/todo';
import { createCallerFactory, createTRPCRouter } from '@/server/api/trpc';

import { footballRouter } from './routers/football';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  todo: todoRouter,
  photos: photosRouter,
  football: footballRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);

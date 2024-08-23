import { eq } from 'drizzle-orm';
import { z } from 'zod';

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '@/server/api/trpc';
import { todos } from '@/server/db/schema';

export const todoRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(todos).values({
        title: input.name,
        createdById: ctx.session.user.id,
      });
    }),

  getLatest: publicProcedure.query(async ({ ctx }) => {
    const todo = await ctx.db.query.todos.findFirst({
      orderBy: (todos, { desc }) => [desc(todos.createdAt)],
    });

    return todo ?? null;
  }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const todos = await ctx.db.query.todos.findMany({
      with: {
        createdById: {
          columns: {
            name: true,
          },
        },
      },
      orderBy: (todos, { desc }) => [desc(todos.createdAt)],
    });

    return todos;
  }),

  update: protectedProcedure
    .input(z.object({ id: z.number(), completed: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(todos)
        .set({ completed: input.completed })
        .where(eq(todos.id, input.id));
    }),
});

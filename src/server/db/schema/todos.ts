import { relations, sql } from 'drizzle-orm';
import {
  index,
  pgTable,
  serial,
  timestamp,
  varchar,
  pgEnum,
} from 'drizzle-orm/pg-core';

import { users } from './users';

export const todoStatusEnum = pgEnum('status', [
  '保留',
  '未着手',
  '進行中',
  '完了',
]);

export const todos = pgTable(
  'todo',
  {
    id: serial('id').primaryKey(),
    title: varchar('title', { length: 256 }).notNull(),
    status: todoStatusEnum('status').notNull(),
    createdById: varchar('created_by', { length: 255 })
      .notNull()
      .references(() => users.id),
    createdAt: timestamp('created_at', { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdate(
      () => new Date()
    ),
  },
  (example) => ({
    createdByIdIdx: index('created_by_idx').on(example.createdById),
    titleIndex: index('title_idx').on(example.title),
  })
);

export const todosRelations = relations(todos, ({ one }) => ({
  createdById: one(users, {
    fields: [todos.createdById],
    references: [users.id],
  }),
}));

'use client';

import { useState } from 'react';

import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { api } from '@/trpc/react';

export function Todos() {
  const utils = api.useUtils();
  const [todos, setTodos] = useState(() => utils.todo.getAll.getData() ?? []);
  const [name, setName] = useState('');

  void api.todo.getAll.useSuspenseQuery();

  const createTodo = api.todo.create.useMutation({
    onSuccess: async () => {
      await utils.todo.invalidate();
      setName('');
    },
  });

  const updateTodo = api.todo.update.useMutation({
    // 楽観的更新 stateを更新して表示上は即時反映してから、APIを叩く
    onMutate: async ({ id, completed }) => {
      await utils.todo.getAll.cancel();
      const prevTodos = utils.todo.getAll.getData();
      setTodos((old) =>
        old.map((t) => (t.id === id ? { ...t, completed } : t))
      );
      return { prevTodos };
    },
    onError: (err, newTodo, context) => {
      setTodos(context?.prevTodos ?? []);
    },
    onSettled: async () => {
      await utils.todo.invalidate();
    },
  });

  return (
    <div className="w-full">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createTodo.mutate({ name });
        }}
        className="flex flex-col gap-2"
      >
        <input
          type="text"
          placeholder="Title"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-full px-4 py-2 text-black"
        />
        <button
          type="submit"
          className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
          disabled={createTodo.isPending}
        >
          {createTodo.isPending ? 'Submitting...' : 'Submit'}
        </button>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>完了</TableHead>
              <TableHead>内容</TableHead>
              <TableHead>作成者</TableHead>
              <TableHead>作成日時</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {todos.map((todo) => (
              <TableRow key={todo.id}>
                <TableCell>
                  <Checkbox
                    checked={!!todo.completed}
                    onCheckedChange={(checked: boolean) => {
                      updateTodo.mutate({ id: todo.id, completed: checked });
                    }}
                  />
                </TableCell>
                <TableCell>{todo.title}</TableCell>
                <TableCell>{todo.createdById.name}</TableCell>
                <TableCell>
                  {new Date(todo.createdAt).toLocaleString('ja-JP')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </form>
    </div>
  );
}

'use client';

import { Trash2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { todoStatusEnum } from '@/server/db/schema';
import { api } from '@/trpc/react';

export function Todos() {
  const utils = api.useUtils();
  const [todos, setTodos] = useState(() => utils.todo.getAll.getData() ?? []);
  const [name, setName] = useState('');

  void api.todo.getAll.useSuspenseQuery();

  const createTodo = api.todo.create.useMutation({
    onSettled: async () => {
      await utils.todo.invalidate();
      setName('');
      setTodos(utils.todo.getAll.getData() ?? []);
    },
  });

  const updateTodo = api.todo.update.useMutation({
    // 楽観的更新 stateを更新して表示上は即時反映してから、APIを叩く
    onMutate: async ({ id, status }) => {
      await utils.todo.getAll.cancel();
      const prevTodos = utils.todo.getAll.getData();
      setTodos((old) => old.map((t) => (t.id === id ? { ...t, status } : t)));
      return { prevTodos };
    },
    onError: (err, newTodo, context) => {
      setTodos(context?.prevTodos ?? []);
    },
    onSettled: async () => {
      await utils.todo.invalidate();
    },
  });

  const deleteTodo = api.todo.delete.useMutation({
    onMutate: async ({ id }) => {
      await utils.todo.getAll.cancel();
      const prevTodos = utils.todo.getAll.getData();
      setTodos((old) => old.filter((t) => t.id !== id));
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
    <div className="w-full flex flex-col gap-10">
      {/* todo作成フォーム */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createTodo.mutate({ name });
        }}
        className="w-2/3 items-start flex gap-2"
      >
        <input
          type="text"
          placeholder="Todoを入力してください"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-2/3 rounded-md px-4 py-2 text-black border border-black"
        />
        <button
          type="submit"
          className="rounded-md bg-slate-500 text-white px-6 py-2"
          disabled={createTodo.isPending}
        >
          {createTodo.isPending ? '作成中' : '作成'}
        </button>
      </form>

      {/* todo一覧テーブル */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>完了</TableHead>
            <TableHead>内容</TableHead>
            <TableHead>作成者</TableHead>
            <TableHead>作成日時</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {todos.map((todo) => (
            <TableRow key={todo.id}>
              <TableCell>
                <Select
                  value={todo.status}
                  onValueChange={(value) => {
                    updateTodo.mutate({
                      id: todo.id,
                      status:
                        value as (typeof todoStatusEnum.enumValues)[number],
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {todoStatusEnum?.enumValues.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>{todo.title}</TableCell>
              <TableCell>{todo.createdById.name}</TableCell>
              <TableCell>
                {new Date(todo.createdAt).toLocaleString('ja-JP')}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteTodo.mutate({ id: todo.id })}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { api } from '@/trpc/react';

import { TodoKanban } from './todoKanban';
import { TodoTable } from './todoTable';

export function Todos() {
  const utils = api.useUtils();
  const [todos, setTodos] = useState(() => utils.todo.getAll.getData() ?? []);
  const [name, setName] = useState('');
  const [isKanban, setIsKanban] = useState(false);

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
      <div className="w-full flex justify-end mb-4">
        <Button onClick={() => setIsKanban(!isKanban)}>
          {isKanban ? 'テーブル表示' : 'カンバン表示'}
        </Button>
      </div>

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
      {isKanban ? (
        <TodoKanban todos={todos} deleteTodo={deleteTodo} />
      ) : (
        <TodoTable
          todos={todos}
          updateTodo={updateTodo}
          deleteTodo={deleteTodo}
        />
      )}
    </div>
  );
}

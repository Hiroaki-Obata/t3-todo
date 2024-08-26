'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { api } from '@/trpc/react';

import { TodoForm } from './todoForm';
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
    onMutate: async ({ id, title, status }) => {
      await utils.todo.getAll.cancel();
      const prevTodos = utils.todo.getAll.getData();
      setTodos((old) =>
        old.map((t) =>
          t.id === id
            ? { ...t, title: title ?? t.title, status: status ?? t.status }
            : t
        )
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
      <TodoForm name={name} setName={setName} createTodo={createTodo} />

      {isKanban ? (
        // todoカンバン
        <TodoKanban
          todos={todos}
          updateTodo={updateTodo}
          deleteTodo={deleteTodo}
        />
      ) : (
        // todoテーブル
        <TodoTable
          todos={todos}
          updateTodo={updateTodo}
          deleteTodo={deleteTodo}
        />
      )}
    </div>
  );
}

'use client';

import { type inferRouterOutputs } from '@trpc/server';
import { Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { cn } from '@/lib/utils';
import { type AppRouter } from '@/server/api/root';
import { todoStatusEnum } from '@/server/db/schema';
import { type api } from '@/trpc/react';

type TodoTableProps = {
  todos: inferRouterOutputs<AppRouter>['todo']['getAll'];
  updateTodo: ReturnType<typeof api.todo.update.useMutation>;
  deleteTodo: ReturnType<typeof api.todo.delete.useMutation>;
};

type TodoTableRowProps = {
  todo: inferRouterOutputs<AppRouter>['todo']['getAll'][number];
  updateTodo: ReturnType<typeof api.todo.update.useMutation>;
  deleteTodo: ReturnType<typeof api.todo.delete.useMutation>;
};

/**
 * ステータスの色を定義
 *
 * 未着手: ピンク
 * 進行中: 黄色
 * 完了: 紫
 * 保留: 緑
 */
const statusColors: Record<(typeof todoStatusEnum.enumValues)[number], string> =
  {
    [todoStatusEnum.enumValues[0]]: 'bg-purple-200 text-purple-800',
    [todoStatusEnum.enumValues[1]]: 'bg-pink-200 text-pink-800',
    [todoStatusEnum.enumValues[2]]: 'bg-yellow-200 text-yellow-800',
    [todoStatusEnum.enumValues[3]]: 'bg-green-200 text-green-800',
  } as const;

const TodoTableRow = ({ todo, updateTodo, deleteTodo }: TodoTableRowProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);

  const handleEditComplete = () => {
    if (isEditing && editedTitle.trim() !== '' && editedTitle !== todo.title) {
      updateTodo.mutate({
        id: todo.id,
        title: editedTitle,
        status: todo.status,
      });
    } else {
      setEditedTitle(todo.title);
    }
    setIsEditing(false);
  };

  return (
    <TableRow key={todo.id}>
      <TableCell>
        <Select
          value={todo.status}
          onValueChange={(value) => {
            updateTodo.mutate({
              id: todo.id,
              title: todo.title ?? '',
              status: value as (typeof todoStatusEnum.enumValues)[number],
            });
          }}
        >
          <SelectTrigger
            className={cn(
              'max-w-[120px] justify-between',
              statusColors[todo.status]
            )}
          >
            <SelectValue>{todo.status}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {todoStatusEnum.enumValues.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>
        <div className="min-w-[200px] max-w-[200px] min-h-6">
          {isEditing ? (
            <Input
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onBlur={handleEditComplete}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleEditComplete();
                }
              }}
            />
          ) : (
            <div className="flex items-center gap-2">
              <span>{todo.title}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </TableCell>
      <TableCell>{todo.createdById.name}</TableCell>
      <TableCell>{new Date(todo.createdAt).toLocaleString('ja-JP')}</TableCell>
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
  );
};

export function TodoTable({ todos, updateTodo, deleteTodo }: TodoTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ステータス</TableHead>
          <TableHead>内容</TableHead>
          <TableHead>作成者</TableHead>
          <TableHead>作成日時</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {todos.map((todo) => (
          <TodoTableRow
            key={todo.id}
            todo={todo}
            updateTodo={updateTodo}
            deleteTodo={deleteTodo}
          />
        ))}
      </TableBody>
    </Table>
  );
}

import { type inferRouterOutputs } from '@trpc/server';
import { Trash2 } from 'lucide-react';

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
import { cn } from '@/lib/utils';
import { type AppRouter } from '@/server/api/root';
import { todoStatusEnum } from '@/server/db/schema';
import { type api } from '@/trpc/react';

type TodoTableProps = {
  todos: inferRouterOutputs<AppRouter>['todo']['getAll'];
  updateTodo: ReturnType<typeof api.todo.update.useMutation>;
  deleteTodo: ReturnType<typeof api.todo.delete.useMutation>;
};

const statusColors = {
  未着手: 'bg-pink-200 text-pink-800',
  進行中: 'bg-yellow-200 text-yellow-800',
  保留: 'bg-purple-200 text-purple-800',
  完了: 'bg-green-200 text-green-800',
} as const;

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
          <TableRow key={todo.id}>
            <TableCell>
              <Select
                value={todo.status}
                onValueChange={(value) => {
                  updateTodo.mutate({
                    id: todo.id,
                    status: value as (typeof todoStatusEnum.enumValues)[number],
                  });
                }}
              >
                <SelectTrigger
                  className={cn(
                    'w-[120px] justify-between',
                    statusColors[todo.status]
                  )}
                >
                  <SelectValue />
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
  );
}

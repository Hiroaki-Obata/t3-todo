import { type inferRouterOutputs } from '@trpc/server';
import { Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { type AppRouter } from '@/server/api/root';
import { todoStatusEnum } from '@/server/db/schema';
import { type api } from '@/trpc/react';

type TodoKanbanProps = {
  todos: inferRouterOutputs<AppRouter>['todo']['getAll'];
  deleteTodo: ReturnType<typeof api.todo.delete.useMutation>;
};

export function TodoKanban({ todos, deleteTodo }: TodoKanbanProps) {
  return (
    <div className="flex space-x-4">
      {todoStatusEnum.enumValues.map((column) => (
        <div key={column} className="flex-1 bg-gray-100 p-4 rounded-lg">
          <h2 className="text-lg font-bold mb-4">{column}</h2>
          <div className="space-y-2">
            {todos
              .filter((todo) => todo.status === column)
              .map((todo) => (
                <div key={todo.id} className="bg-white p-2 rounded shadow">
                  <p>{todo.title}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteTodo.mutate({ id: todo.id })}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

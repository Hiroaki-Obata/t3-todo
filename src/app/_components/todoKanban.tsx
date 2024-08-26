import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from '@hello-pangea/dnd';
import { type inferRouterOutputs } from '@trpc/server';
import { Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { type AppRouter } from '@/server/api/root';
import { todoStatusEnum } from '@/server/db/schema';
import { type api } from '@/trpc/react';

type TodoKanbanProps = {
  todos: inferRouterOutputs<AppRouter>['todo']['getAll'];
  updateTodo: ReturnType<typeof api.todo.update.useMutation>;
  deleteTodo: ReturnType<typeof api.todo.delete.useMutation>;
};

export function TodoKanban({ todos, updateTodo, deleteTodo }: TodoKanbanProps) {
  const onDragEnd = (result: DropResult) => {
    console.log(result);
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    if (source.droppableId !== destination.droppableId) {
      updateTodo.mutate({
        id: parseInt(draggableId),
        title:
          todos.find((todo) => todo.id === parseInt(draggableId))?.title ?? '',
        status:
          destination.droppableId as (typeof todoStatusEnum.enumValues)[number],
      });
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex space-x-4">
        {todoStatusEnum.enumValues.map((column) => (
          <Droppable key={column} droppableId={column}>
            {(provided) => (
              <div
                className="flex-1 bg-gray-100 p-4 rounded-lg"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <h2 className="text-lg font-bold mb-4">{column}</h2>
                <div className="space-y-2">
                  {todos
                    .filter((todo) => todo.status === column)
                    .map((todo, index) => (
                      <Draggable
                        key={todo.id.toString()}
                        draggableId={todo.id.toString()}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            key={todo.id.toString()}
                            className="bg-white p-2 rounded shadow flex flex-col h-full"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <p className="flex-grow">{todo.title}</p>
                            <div className="flex justify-end items-end">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  deleteTodo.mutate({ id: todo.id })
                                }
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}

import { type api } from '@/trpc/react';

type TodoFormProps = {
  name: string;
  setName: (name: string) => void;
  createTodo: ReturnType<typeof api.todo.create.useMutation>;
};

export function TodoForm({ name, setName, createTodo }: TodoFormProps) {
  return (
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
  );
}

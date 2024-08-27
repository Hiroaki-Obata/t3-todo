import { Todos } from '@/app/todos/_components/todos';
import { getServerAuthSession } from '@/server/auth';
import { HydrateClient } from '@/trpc/server';

export default async function TodosPage() {
  const session = await getServerAuthSession();

  return (
    <HydrateClient>
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        {session?.user ? <Todos /> : <div>ログインしてください</div>}
      </div>
    </HydrateClient>
  );
}

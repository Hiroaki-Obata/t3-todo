import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { api } from '@/trpc/server';

import { PlayerTable } from './_components/PlayerTable';

export default async function TeamDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const teamId = parseInt(params.id, 10);
  const team = await api.football.getTeamById({ id: teamId });

  if (!team) {
    return <div>チームが見つかりません</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="relative mb-8">
        <Link href="/football" passHref className="absolute right-0 top-0">
          <Button variant="ghost" size="sm" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            チーム一覧に戻る
          </Button>
        </Link>
      </div>

      <h1 className="mb-4 text-4xl font-bold">{team.name}</h1>

      <div className="flex-shrink-0 py-4">
        <Image src={team.crest} alt={team.name} width={50} height={50} />
      </div>
      <div>
        <p>設立: {`${team.founded}年`}</p>
        <p>スタジアム: {team.venue}</p>
      </div>

      <h2 className="mt-8 mb-4 text-xl font-semibold">選手一覧</h2>
      <PlayerTable data={team.squad} />
    </div>
  );
}

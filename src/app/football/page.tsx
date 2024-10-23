import { api } from '@/trpc/server';

// import MatchList from './_components/MatchList';
import TeamList from './_components/TeamList';

export default async function FootballPage() {
  // const matches = await api.football.getPremierLeagueMatches({});

  const teams = await api.football.getPremierLeagueTeams();

  const squad = await api.football.getArsenalSquad();

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-2xl font-bold">プレミアリーグ情報</h1>
      <div>
        {/* <Suspense fallback={<div>試合データを読み込み中...</div>}>
          <MatchList matches={matches} />
        </Suspense> */}
        <TeamList teams={teams} />
      </div>
    </div>
  );
}

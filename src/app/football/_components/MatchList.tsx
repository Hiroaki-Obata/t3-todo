/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */

interface Match {
  id: string;
  homeTeam: { name: string };
  awayTeam: { name: string };
}

interface MatchListProps {
  matches: {
    matches: Match[];
  };
}

export default function MatchList({ matches }: MatchListProps) {
  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold">試合一覧</h2>
      <ul className="space-y-2">
        {matches.matches.map((match) => (
          <li key={match.id} className="rounded bg-gray-100 p-2">
            {match.homeTeam.name} vs {match.awayTeam.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

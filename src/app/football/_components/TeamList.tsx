/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */

import Image from 'next/image';
import Link from 'next/link';

interface TeamListProps {
  teams: Team[];
}

// チームの地域、エンブレム
type Area = {
  id: number;
  name: string;
  code: string;
  flag: string;
};

// 大会
type Competition = {
  id: number;
  code: string;
  emblem: string;
  name: string;
  type: string;
};

export type Player = {
  id: number;
  dateOfBirth: string;
  name: string;
  nationality: string;
  position: string;
};

export type Coach = {
  id: number;
  contract: {
    start: string;
    until: string;
  };
  dateOfBirth: string;
  firstName: string;
  lastName: string;
  name: string;
  nationality: string;
};

// チーム
export type Team = {
  id: number;
  address: string;
  area: Area;
  clubColors: string;
  coach: Coach;
  crest: string;
  founded: number;
  lastUpdated: Date;
  name: string;
  runningCompetitions: Competition[];
  shortName: string;
  tla: string;
  website: string;
  venue: string;
};

export default function TeamList({ teams }: TeamListProps) {
  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold">チーム一覧</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {teams.map((team) => (
          <li
            key={team.id}
            className="rounded bg-gray-100 p-4 flex items-center space-x-4"
          >
            <Link href={`/football/${team.id}`}>
              <div className="flex-grow">
                <Image
                  src={team.crest}
                  alt={team.name}
                  width={50}
                  height={50}
                />
                <h3 className="font-semibold">{team.name}</h3>
                <p className="text-sm text-gray-600">{team.tla}</p>
                <p className="text-xs text-gray-500">ID: {team.id}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

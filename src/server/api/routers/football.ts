/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from 'zod';

import { type Player, type Team } from '@/app/football/_components/TeamList';
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';

const FOOTBALL_DATA_API_KEY = process.env.FOOTBALL_DATA_API_KEY;
const PREMIER_LEAGUE_ID = 2021; // プレミアリーグのID
const ARSENAL_TEAM_ID = 57; // アーセナルのID

async function fetchFootballData(endpoint: string): Promise<any> {
  const response = await fetch(`https://api.football-data.org/v4/${endpoint}`, {
    headers: {
      'X-Auth-Token': FOOTBALL_DATA_API_KEY!,
    },
  });

  if (!response.ok) {
    throw new Error(`Football Data API error: ${response.statusText}`);
  }

  return response.json();
}

export const footballRouter = createTRPCRouter({
  getPremierLeagueMatches: publicProcedure
    .input(
      z.object({
        dateFrom: z.string().optional(),
        dateTo: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const { dateFrom, dateTo } = input;
      const dateParams =
        dateFrom && dateTo ? `&dateFrom=${dateFrom}&dateTo=${dateTo}` : '';
      const data = await fetchFootballData(
        `competitions/${PREMIER_LEAGUE_ID}/matches?${dateParams}`
      );
      return data;
    }),

  getPremierLeagueTeams: publicProcedure.query(async () => {
    const data: { teams: Team[] } = await fetchFootballData(
      `competitions/${PREMIER_LEAGUE_ID}/teams`
    );
    return data.teams;
  }),

  getTeamById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const data: Team & { squad: Player[] } = await fetchFootballData(
        `teams/${input.id}`
      );
      return data;
    }),

  getArsenalSquad: publicProcedure.query(async () => {
    const data: Team & { squad: Player[] } = await fetchFootballData(
      `teams/${ARSENAL_TEAM_ID}`
    );
    return data.squad;
  }),
});

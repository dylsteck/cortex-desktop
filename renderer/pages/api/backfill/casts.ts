import type { NextApiRequest, NextApiResponse } from 'next';
import { KyselyDB } from '../../../types/database';
import { sql } from 'kysely';
import { db } from '../../../lib/kysely';
import { convertToCasts } from '../../../lib/format';

type OutputData = {
  message: string;
};

// helper to get the most recent timestamp time from the database
async function getLastTimestampFromDatabase() {
    // timestamp for 2022-10-31 00:00:00
    const defaultTimestamp = '1677657600000';
    try {
      const result = await sql<KyselyDB['casts']>`SELECT MAX(timestamp) AS timestamp FROM casts;`.execute(db);
      const lastTimestamp = result.rows[0].timestamp;
      return lastTimestamp ? lastTimestamp : defaultTimestamp;
    } catch (error) {
      console.error("Error getting last timestamp time from the db", error);
      return defaultTimestamp;
    }
  }
  
// TODO: handle duplicate error so more recent casts can be backfilled properly
// the rest works great
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<OutputData>
) {
  const latestCastsRoute = 'https://api.farcasterkit.com/casts/latest';
  const fid = '616';
  let cursor = 0;
  let totalCasts = 0;

  const lastBackfilledTime = await getLastTimestampFromDatabase();

  while (true) {
    const response = await fetch(`${latestCastsRoute}?fid=${fid}&cursor=${cursor}`);
    const data = await response.json();
    const { casts, nextCursor } = data;

    if (casts.length === 0 || nextCursor === cursor) {
      break;
    }
    try {
        const formattedCasts = casts
        .map(cast => convertToCasts(cast));
      
        await db
          .insertInto('casts')
          .values(formattedCasts as KyselyDB['casts'][])
          .execute();
      
        totalCasts += formattedCasts.length;
        cursor = nextCursor;
      } catch (error) {
        console.error("Error inserting into db", error);
        return res.status(500).json({ message: 'Error inserting into the database.' });
    }      
  }

  return res.status(200).json({ message: `Total casts backfilled: ${totalCasts}` });
}
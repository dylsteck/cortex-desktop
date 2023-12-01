// pages/api/getTimeline.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import type { KyselyDB } from '../../types/database';
import { sql } from 'kysely';
import { db } from '../../lib/kysely';


type OutputData = {
  feed: Record<string, { type: string, object: any }[]>;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<OutputData>
) {
  const { day } = req.query;
  if (typeof day !== 'string') {
    res.status(400).json({ error: 'Day must be a string in the format YYYY-MM-DD' });
    return;
  }

  const startOfDay = `${day}T00:00:00.000`;
  const endOfDay = `${day}T23:59:59.999`;

  const casts = await db
    .selectFrom('casts')
    .selectAll()
    .where('timestamp', '>=', startOfDay)
    .where('timestamp', '<=', endOfDay)
    .execute();

  const urls = await db
    .selectFrom('urls')
    .selectAll()
    .where('created_at', '>=', startOfDay)
    .where('created_at', '<=', endOfDay)
    .execute();

  const notes = await db
    .selectFrom('notes')
    .selectAll()
    .where('createdAt', '>=', startOfDay)
    .where('createdAt', '<=', endOfDay)
    .execute();

  const combinedArray = [...casts, ...urls, ...notes];

  const groupedByHour = combinedArray.reduce((acc, obj) => {
    const timestamp = new Date(obj.created_at || obj.createdAt).getTime();
    const hour = new Date(timestamp).getUTCHours().toString().padStart(2, '0'); // Convert to 24-hour format

    if (!acc[hour]) {
      acc[hour] = [];
    }

    const type = obj.hasOwnProperty('url') ? 'urls' : obj.hasOwnProperty('text') ? 'casts' : 'notes';
    acc[hour].push({ type, object: obj });
    return acc;
  }, {});

  return res.status(200).json({ feed: groupedByHour });
}
import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../lib/kysely';
import type { KyselyDB } from '../../types/database';
import { sql } from 'kysely';

interface UrlItem {
  type: 'urls' | 'notes';
  object: KyselyDB['urls'] | KyselyDB['notes'];
}

type OutputData = {
  feed: UrlItem[];
};

export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse<OutputData | { error: string }>
) {
  const { day } = req.query;
  if (typeof day !== 'string') {
    res.status(400).json({ error: 'Day must be a string in the format YYYY-MM-DD' });
    return;
  }

  try {
    const dayPattern = `${day}%`;
    const notesQuery = sql<KyselyDB['urls']>`
      SELECT * FROM notes
      WHERE updatedAt LIKE ${dayPattern}
    `;
    const urlsQuery = sql<KyselyDB['urls']>`
      SELECT * FROM urls
      WHERE last_visited LIKE ${dayPattern}
    `;
    const notes = await notesQuery.execute(db);
    const urls = await urlsQuery.execute(db);

    const combinedArray: TimelineItem[] = [
      ...urls.rows.map(item => ({ type: 'urls', object: item })),
      ...notes.rows.map(item => ({ type: 'notes', object: item }))
    ];

    res.status(200).json({ feed: combinedArray });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve records' });
  }
}
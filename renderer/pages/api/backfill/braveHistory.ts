import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import sqlite3 from 'sqlite3';
import { db } from '../../../lib/kysely';
import { KyselyDB } from '../../../types/database';
import { sql } from 'kysely';

type OutputData = {
  message: string;
};

// helper to get the most recent created_at time from db
async function getLastCreatedTimeFromDatabase() {
  const defaultTimestamp = new Date('2022-10-31 00:00:00').getTime();
  try {
    const result = await sql<KyselyDB['urls']>`SELECT MAX(created_at) AS created_at FROM urls;`.execute(db);
    const lastCreatedAt = result.rows[0].created_at;
    const lastCreatedAtTimestamp = new Date(lastCreatedAt).getTime();
    return lastCreatedAt ? lastCreatedAtTimestamp : defaultTimestamp;
  } catch (error) {
    console.error("Error getting last created_at time from the db", error);
    return new Date('2022-10-31 00:00:00').getTime();
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<OutputData>
) {
  // local path to Brave on my Mac(more stable path resolution and Chrome support TBD)
  const filePath = path.join(
    process.env.HOME,
    'Library', 'Application Support', 'BraveSoftware', 'Brave-Browser', 'Default', 'History'
  );

  if (fs.existsSync(filePath)) {
    // temporary copy of the Brave history db
    const copyFilePath = path.join(__dirname, 'history_copy.db');
    fs.copyFile(filePath, copyFilePath, async (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error copying History to history_copy.db' });
      }
      const historyCopy = new sqlite3.Database(copyFilePath);

      let cursor = 0;
      let backfilledCount = 0;
      let lastBackfilledTime = await getLastCreatedTimeFromDatabase();
      // get most recent urls from history_copy given lastBackfilledTime and cursor
      while (true) {
        const rows = await new Promise<any[]>((resolve, reject) => {
          historyCopy.all(
            `SELECT 
              datetime(last_visit_time/1000000-11644473600, "unixepoch") as last_visited, 
              url, 
              title, 
              visit_count 
            FROM urls
            WHERE last_visited >= ?
            ORDER BY last_visited DESC
            LIMIT ?, 100`, 
            [lastBackfilledTime, cursor],
            (err, rows) => {
              if (err) {
                console.error(err.message);
                reject(err);
              }
              resolve(rows);
            }
          );
        });

        if (rows.length === 0) {
          break;
        }

        try {
          // add the most recent back of urls from history_copy.db to the main db
          await db.insertInto('urls').values(rows as KyselyDB['urls'][]).execute();
          backfilledCount += rows.length;
        } catch (error) {
          console.error("Error inserting into db", error);
          return res.status(500).json({ message: 'Error inserting into the database.' });
        }

        cursor += 100;
      }

      historyCopy.close();
      fs.unlinkSync(copyFilePath);
      // Return the number of backfilled urls from history_copy.db to the main db
      return res.status(200).json({ message: `Number backfilled: ${backfilledCount}` });
    });
  } else {
    res.status(404).json({ message: 'History file not found.' });
  }
}
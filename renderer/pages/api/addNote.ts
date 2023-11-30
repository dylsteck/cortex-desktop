// pages/api/addNote.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../lib/kysely';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  try {
    const notes = req.body; // Expecting an array of notes
    await db.insertInto('notes').values(notes).execute();
    res.status(200).json({ message: 'Notes added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding notes to the database' });
  } finally {
    db.destroy();
  }
}
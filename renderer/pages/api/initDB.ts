import type { NextApiRequest, NextApiResponse } from 'next';
import Database from 'better-sqlite3';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = new Database('./db/nexus.db', { verbose: console.log });

  try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS urls (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        url TEXT NOT NULL,
        title TEXT NOT NULL,
        visit_count INTEGER NOT NULL,
        last_visited TEXT NOT NULL,
        created_at TEXT DEFAULT (strftime('%Y-%m-%d %H:%M:%S', 'now'))
      );
    `);

    db.exec(`
      CREATE TABLE IF NOT EXISTS casts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        deleted_at INTEGER,
        timestamp INTEGER NOT NULL,
        fid INTEGER NOT NULL,
        text TEXT NOT NULL,
        hash TEXT NOT NULL,
        parent_hash TEXT,
        parent_fid INTEGER,
        parent_url TEXT,
        pfp TEXT,
        embeds TEXT,
        mentions TEXT,
        mentions_positions TEXT
      );
    `);

    db.exec(`
      CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fileName TEXT,
        text TEXT NOT NULL,
        createdAt TEXT DEFAULT (strftime('%Y-%m-%d %H:%M:%S', 'now')),
        updatedAt TEXT DEFAULT (strftime('%Y-%m-%d %H:%M:%S', 'now'))
      );
    `);

    res.status(200).json({ message: 'Database initialized successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error initializing the database' });
  } finally {
    db.close();
  }
}
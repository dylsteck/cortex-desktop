import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const dbPath = path.resolve('./db/nexus.db');
  const exists = fs.existsSync(dbPath);
  
  res.status(200).json({ exists });
}
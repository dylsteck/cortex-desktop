import { KyselyDB } from "../types/database";
import fs from 'fs';
import path from 'path';

export function convertToCasts(inputObject: any) {
    return {
      created_at: new Date(inputObject.created_at).getTime(),
      updated_at: new Date(inputObject.updated_at).getTime(),
      deleted_at: inputObject.deleted_at ? new Date(inputObject.deleted_at).getTime() : null,
      timestamp: new Date(inputObject.timestamp).getTime(),
      fid: parseInt(inputObject.fid),
      text: inputObject.text,
      hash: inputObject.hash,
      parent_hash: inputObject.parent_hash,
      parent_fid: inputObject.parent_fid ? parseInt(inputObject.parent_fid) : null,
      parent_url: inputObject.parent_url,
      pfp: inputObject.pfp,
      embeds: JSON.stringify([]),
      mentions: JSON.stringify([]),
      mentions_positions: JSON.stringify([])
    };
}  

export async function dbExists(): Promise<boolean> {
  const response = await fetch('/api/dbExists');
  const data = await response.json();
  return data.exists;
}
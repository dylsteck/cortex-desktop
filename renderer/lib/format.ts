import { KyselyDB } from "../types/database";

export function convertToCasts(inputObject: any) {
    return {
      created_at: new Date(inputObject.created_at).toISOString(),
      updated_at: new Date(inputObject.updated_at).toISOString(),
      deleted_at: inputObject.deleted_at ? new Date(inputObject.deleted_at).toISOString() : null,
      timestamp: new Date(inputObject.timestamp).toISOString(),
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
export interface KyselyDB {
  urls: {
    id: number;
    url: string;
    title: string;
    visit_count: number;
    last_visited: string;
    created_at: string;
  };
  
  casts: {
    id: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    timestamp: number;
    fid: number;
    text: string;
    hash: string;
    parent_hash: string | null;
    parent_fid: number | null;
    parent_url: string | null;
    pfp: string | null;
    embeds: string;
    mentions: string;
    mentions_positions: string;
  };

  notes: {
    id: number;
    fileName: string | null;
    text: string;
    createdAt: string;
    updatedAt: string;
  };
}
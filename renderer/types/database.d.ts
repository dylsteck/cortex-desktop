import { type Generated, type GeneratedAlways } from "kysely";

export interface KyselyDB {
  urls: {
    id: bigint;
    url: string;
    title: string;
    visit_count: number;
    last_visited: string;
    created_at: Generated<Date>;
  };
  
  casts: {
    id: GeneratedAlways<number>;
    created_at: Generated<Date>;
    updated_at: Generated<Date>;
    deleted_at: Date | null;
    timestamp: Date;
    fid: number;
    text: string;
    hash: string;
    parent_hash: string | null;
    parent_fid: number | null;
    parent_url: string | null;
    pfp: string | null;
    embeds: Generated<
      {
        url?: string | undefined;
        castId?: object | undefined;
      }[]
    >;
    mentions: Generated<number[]>;
    mentions_positions: Generated<number[]>;
  };

  notes: {
    id: GeneratedAlways<number>;
    fileName: string | null;
    text: string;
    createdAt: Generated<Date>;
    updatedAt: Generated<Date>;
  };
}
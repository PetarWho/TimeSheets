export interface Team {
  id: bigint;
  name: string;
  project: string;
  project_id: bigint;
  created_at: Date;
  updated_at: Date;
  members: number;
}

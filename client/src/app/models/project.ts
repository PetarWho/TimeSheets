export interface Project {
  id: bigint;
  name: string;
  created_at: number;
  updated_at: number;
  client_id: bigint;
  client_name?: string;
}

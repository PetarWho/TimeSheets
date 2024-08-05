export default interface User {
  id: bigint;
  role_id: bigint;
  role: string;
  name: string;
  email: string;
  google_id: string;
  avatar: string;
  deactivated: boolean;
  created_at: Date;
  updated_at: Date;
  email_verified_at: Date;
}

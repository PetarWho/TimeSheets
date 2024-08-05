class User {
  id: bigint;
  role_id: bigint;
  name: string;
  email: string;
  email_verified_at: number;
  remember_token: string | null;
  password: string | null;
  google_id: string;
  avatar: string | null;
  deactivated: boolean;
  created_at: number;
  updated_at: number;
  constructor(
    id: bigint,
    role_id: bigint,
    name: string,
    email: string,
    email_verified_at: number,
    remember_token: string | null,
    google_id: string,
    avatar: string | null,
    deactivated: boolean,
    created_at: number,
    updated_at: number
  ) {
    this.id = id;
    this.role_id = role_id;
    this.name = name;
    this.email = email;
    this.email_verified_at = email_verified_at;
    this.password = null;
    this.remember_token = remember_token;
    this.google_id = google_id;
    this.avatar = avatar;
    this.deactivated = deactivated;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}

export default User;

class JWToken {
  jwt: string;
  expiry_date: number;
  user_id: bigint;

  constructor(jwt: string, expiry_date: number, user_id: bigint) {
    this.jwt = jwt;
    this.expiry_date = expiry_date;
    this.user_id = user_id;
  }
}

export default JWToken;

export interface UserPayload {
  userName: string;
  userId: string;
  iat: number;
  exp: number;
  role?: string;
}

export interface JwtPayload {
  sub: number; // User ID
  username: string;
  roles: string[]; // List of user roles
}

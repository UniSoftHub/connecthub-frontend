import { UserRole, IUserResponse } from './user';

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IAuthResponse {
  token: string;
  refreshToken: string;
  user: IUserResponse;
}

export interface IJwtPayload {
  iss: string;
  upn: string;
  sub: string;
  userId: number;
  name: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
  jti: string;
  type?: 'refresh';
}

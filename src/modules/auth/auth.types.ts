export interface ITokenPayload {
  id: string;
  email: string;
  role: string;
}

export interface ILoginResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
  };
  accessToken: string;
  refreshToken: string;
}

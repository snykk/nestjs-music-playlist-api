export class RegisRequest {
  username: string;
  password: string;
}

export class LoginRequest {
  username: string;
  password: string;
}

export class RegisResponse {
  id: number;
  username: string;
  passwordHash: string;
}

export class LoginResponse {
  accessToken: string;
}

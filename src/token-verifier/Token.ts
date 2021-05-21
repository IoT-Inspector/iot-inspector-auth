import decode, { JwtPayload } from "jwt-decode";

export type TokenPayload = JwtPayload & {
  nonce?: string;
  "https://www.iot-inspector.com/tenants"?: Array<{
    id: string;
    name: string;
  }>;
};

class Token {
  raw: string;
  payload: TokenPayload;

  constructor(token: string) {
    this.raw = token;
    this.payload = decode<TokenPayload>(token);
  }
}

export default Token;

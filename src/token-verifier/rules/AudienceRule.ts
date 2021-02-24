import Token from "../Token";
import { TokenVerificationError } from "../TokenVerifier";
import Rule from "./Rule";

class AudienceRule extends Rule {
  audience: string;

  constructor(audience: string) {
    super();
    this.audience = audience;
  }

  verify(token: Token): boolean {
    if (!token.payload.aud) {
      throw new TokenVerificationError('Audience is missing');
    }
    if (token.payload.aud !== this.audience) {
      throw new TokenVerificationError(`Audience must be ${this.audience}, got ${token.payload.aud}`);
    }
    return true;
  }
}

export default AudienceRule;

import Token from "../Token";
import { TokenVerificationError } from "../TokenVerifier";
import Rule from "./Rule";

class IssuerRule extends Rule {
  issuer: string;

  constructor(issuer: string) {
    super();
    this.issuer = issuer;
  }

  verify(token: Token): boolean {
    if (!token.payload.iss) {
      throw new TokenVerificationError('Issuer is missing');
    }
    if (token.payload.iss !== this.issuer) {
      throw new TokenVerificationError(`Issuer must be ${this.issuer}, got ${token.payload.iss}`);
    }
    return true;
  }
}

export default IssuerRule;

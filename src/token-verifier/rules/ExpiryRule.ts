import Token from "../Token";
import { TokenVerificationError } from "../TokenVerifier";
import Rule from "./Rule";

class ExpiryRule extends Rule {
  verify(token: Token): boolean {
    if (!token.payload.exp) {
      throw new TokenVerificationError("Expiration is missing");
    }

    if (token.payload.exp < this.currentTimestamp) {
      throw new TokenVerificationError("Token expired");
    }
    return true;
  }

  private get currentTimestamp() {
    return Math.round(new Date().getTime() / 1000);
  }
}

export default ExpiryRule;

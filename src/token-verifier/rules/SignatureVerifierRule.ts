import { verify as jwsVerify } from "jws";
import Token from "../Token";
import { TokenVerificationError } from "../TokenVerifier";
import Rule from "./Rule";

const ALGORITHM = "RS256";

class SignatureVerifierRule extends Rule {
  private key: string;

  constructor(key: string) {
    super();
    this.key = key;
  }

  verify(token: Token): boolean {
    if (!jwsVerify(token.raw, ALGORITHM, this.key)) {
      throw new TokenVerificationError("Invalid token signature");
    }
    return true;
  }
}

export default SignatureVerifierRule;

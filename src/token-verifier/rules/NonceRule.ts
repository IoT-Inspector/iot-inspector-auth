import Token from '../Token';
import Rule from './Rule';
import { TokenVerificationError } from '../TokenVerifier';


class NonceRule extends Rule {
  nonce: string;

  constructor(nonce: string) {
    super();
    this.nonce = nonce;
  }

  verify(token: Token): boolean {
    if (!this.nonce) {
      throw new TokenVerificationError('Missing nonce value');
    }
    if (!token.payload.nonce) {
      throw new TokenVerificationError('Nonce is missing');
    }
    if (token.payload.nonce !== this.nonce) {
      throw new TokenVerificationError(`Nonce must be ${this.nonce} but it was ${token.payload.nonce}`)
    }
    return true;
  }
}

export default NonceRule;

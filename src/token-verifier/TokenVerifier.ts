import { AuthConfig } from "../AuthConfig";
import AudienceRule from "./rules/AudienceRule";
import ExpiryRule from "./rules/ExpiryRule";
import IssuerRule from "./rules/IssuerRule";
import NonceRule from "./rules/NonceRule";
import Rule from "./rules/Rule";
import SignatureVerifierRule from "./rules/SignatureVerifierRule";
import Token from "./Token";

export class TokenVerificationError extends Error {}

class TokenVerifier {
  private rules: Array<Rule>;

  constructor(rules: Array<Rule>) {
    this.rules = rules;
  }

  verify(token: Token): boolean {
    return this.rules.every((rule) => rule.verify(token));
  }

  static createIdTokenVerifier(
    config: AuthConfig,
    nonce?: string
  ): TokenVerifier {
    const rules: Array<Rule> = [
      new SignatureVerifierRule(config.publicKeys.idToken),
      new ExpiryRule(),
      new IssuerRule(config.issuer),
      new AudienceRule(config.audience),
    ];
    if (nonce) {
      rules.push(new NonceRule(nonce));
    }

    return new TokenVerifier(rules);
  }

  static createTenantTokenVerifier(
    config: AuthConfig,
    nonce: string
  ): TokenVerifier {
    return new TokenVerifier([
      new SignatureVerifierRule(config.publicKeys.tenantToken),
      new ExpiryRule(),
      new IssuerRule(config.issuer),
      new AudienceRule(config.audience),
      new NonceRule(nonce),
    ]);
  }
}

export default TokenVerifier;

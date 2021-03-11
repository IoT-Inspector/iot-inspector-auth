import { AuthConfig } from "../AuthConfig";
import Rule from "./rules/Rule";
import Token from "./Token";
export declare class TokenVerificationError extends Error {
}
declare class TokenVerifier {
    private rules;
    constructor(rules: Array<Rule>);
    verify(token: Token): boolean;
    static createIdTokenVerifier(config: AuthConfig, nonce?: string): TokenVerifier;
    static createTenantTokenVerifier(config: AuthConfig, nonce: string): TokenVerifier;
}
export default TokenVerifier;

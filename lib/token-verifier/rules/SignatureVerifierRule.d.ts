import Token from '../Token';
import Rule from "./Rule";
declare class SignatureVerifierRule extends Rule {
    private key;
    constructor(key: string);
    verify(token: Token): boolean;
}
export default SignatureVerifierRule;

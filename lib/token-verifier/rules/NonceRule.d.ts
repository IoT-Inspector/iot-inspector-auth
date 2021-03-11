import Token from '../Token';
import Rule from './Rule';
declare class NonceRule extends Rule {
    nonce: string;
    constructor(nonce: string);
    verify(token: Token): boolean;
}
export default NonceRule;

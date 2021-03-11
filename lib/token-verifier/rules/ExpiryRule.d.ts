import Token from '../Token';
import Rule from "./Rule";
declare class ExpiryRule extends Rule {
    verify(token: Token): boolean;
    private get currentTimestamp();
}
export default ExpiryRule;

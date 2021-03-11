import Token from "../Token";
import Rule from "./Rule";
declare class IssuerRule extends Rule {
    issuer: string;
    constructor(issuer: string);
    verify(token: Token): boolean;
}
export default IssuerRule;

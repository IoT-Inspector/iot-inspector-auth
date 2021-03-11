import Token from "../Token";
import Rule from "./Rule";
declare class AudienceRule extends Rule {
    audience: string;
    constructor(audience: string);
    verify(token: Token): boolean;
}
export default AudienceRule;

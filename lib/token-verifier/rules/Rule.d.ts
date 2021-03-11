import Token from "../Token";
declare abstract class Rule {
    abstract verify(token: Token): boolean;
}
export default Rule;

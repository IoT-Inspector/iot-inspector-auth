import Token from "../Token";

abstract class Rule {
  abstract verify(token: Token): boolean;
}

export default Rule;

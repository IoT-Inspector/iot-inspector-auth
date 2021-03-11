import { JwtPayload } from "jwt-decode";
export declare type TokenPayload = JwtPayload & {
    nonce?: string;
    'https://www.iot-inspector.com/tenants'?: Array<{
        id: string;
        name: string;
    }>;
};
declare class Token {
    raw: string;
    payload: TokenPayload;
    constructor(token: string);
}
export default Token;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jwt_decode_1 = __importDefault(require("jwt-decode"));
var Token = /** @class */ (function () {
    function Token(token) {
        this.raw = token;
        this.payload = jwt_decode_1.default(token);
    }
    return Token;
}());
exports.default = Token;

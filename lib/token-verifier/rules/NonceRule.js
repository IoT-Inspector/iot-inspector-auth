"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Rule_1 = __importDefault(require("./Rule"));
var TokenVerifier_1 = require("../TokenVerifier");
var NonceRule = /** @class */ (function (_super) {
    __extends(NonceRule, _super);
    function NonceRule(nonce) {
        var _this = _super.call(this) || this;
        _this.nonce = nonce;
        return _this;
    }
    NonceRule.prototype.verify = function (token) {
        if (!this.nonce) {
            throw new TokenVerifier_1.TokenVerificationError('Missing nonce value');
        }
        if (!token.payload.nonce) {
            throw new TokenVerifier_1.TokenVerificationError('Nonce is missing');
        }
        if (token.payload.nonce !== this.nonce) {
            throw new TokenVerifier_1.TokenVerificationError("Nonce must be " + this.nonce + " but it was " + token.payload.nonce);
        }
        return true;
    };
    return NonceRule;
}(Rule_1.default));
exports.default = NonceRule;

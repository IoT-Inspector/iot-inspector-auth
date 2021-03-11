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
var jws_1 = require("jws");
var TokenVerifier_1 = require("../TokenVerifier");
var Rule_1 = __importDefault(require("./Rule"));
var ALGORITHM = "RS256";
var SignatureVerifierRule = /** @class */ (function (_super) {
    __extends(SignatureVerifierRule, _super);
    function SignatureVerifierRule(key) {
        var _this = _super.call(this) || this;
        _this.key = key;
        return _this;
    }
    SignatureVerifierRule.prototype.verify = function (token) {
        if (!jws_1.verify(token.raw, ALGORITHM, this.key)) {
            throw new TokenVerifier_1.TokenVerificationError('Invalid token signature');
        }
        return true;
    };
    return SignatureVerifierRule;
}(Rule_1.default));
exports.default = SignatureVerifierRule;

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
var TokenVerifier_1 = require("../TokenVerifier");
var Rule_1 = __importDefault(require("./Rule"));
var IssuerRule = /** @class */ (function (_super) {
    __extends(IssuerRule, _super);
    function IssuerRule(issuer) {
        var _this = _super.call(this) || this;
        _this.issuer = issuer;
        return _this;
    }
    IssuerRule.prototype.verify = function (token) {
        if (!token.payload.iss) {
            throw new TokenVerifier_1.TokenVerificationError('Issuer is missing');
        }
        if (token.payload.iss !== this.issuer) {
            throw new TokenVerifier_1.TokenVerificationError("Issuer must be " + this.issuer + ", got " + token.payload.iss);
        }
        return true;
    };
    return IssuerRule;
}(Rule_1.default));
exports.default = IssuerRule;

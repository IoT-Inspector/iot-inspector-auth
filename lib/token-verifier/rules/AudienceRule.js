"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
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
var AudienceRule = /** @class */ (function (_super) {
    __extends(AudienceRule, _super);
    function AudienceRule(audience) {
        var _this = _super.call(this) || this;
        _this.audience = audience;
        return _this;
    }
    AudienceRule.prototype.verify = function (token) {
        if (!token.payload.aud) {
            throw new TokenVerifier_1.TokenVerificationError('Audience is missing');
        }
        if (token.payload.aud !== this.audience) {
            throw new TokenVerifier_1.TokenVerificationError("Audience must be " + this.audience + ", got " + token.payload.aud);
        }
        return true;
    };
    return AudienceRule;
}(Rule_1.default));
exports.default = AudienceRule;

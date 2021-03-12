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
var ExpiryRule = /** @class */ (function (_super) {
    __extends(ExpiryRule, _super);
    function ExpiryRule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ExpiryRule.prototype.verify = function (token) {
        if (!token.payload.exp) {
            throw new TokenVerifier_1.TokenVerificationError('Expiration is missing');
        }
        if (token.payload.exp < this.currentTimestamp) {
            throw new TokenVerifier_1.TokenVerificationError('Token expired');
        }
        return true;
    };
    Object.defineProperty(ExpiryRule.prototype, "currentTimestamp", {
        get: function () {
            return Math.round((new Date()).getTime() / 1000);
        },
        enumerable: false,
        configurable: true
    });
    return ExpiryRule;
}(Rule_1.default));
exports.default = ExpiryRule;

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
exports.TokenVerificationError = void 0;
var AudienceRule_1 = __importDefault(require("./rules/AudienceRule"));
var ExpiryRule_1 = __importDefault(require("./rules/ExpiryRule"));
var IssuerRule_1 = __importDefault(require("./rules/IssuerRule"));
var NonceRule_1 = __importDefault(require("./rules/NonceRule"));
var SignatureVerifierRule_1 = __importDefault(require("./rules/SignatureVerifierRule"));
var TokenVerificationError = /** @class */ (function (_super) {
    __extends(TokenVerificationError, _super);
    function TokenVerificationError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return TokenVerificationError;
}(Error));
exports.TokenVerificationError = TokenVerificationError;
var TokenVerifier = /** @class */ (function () {
    function TokenVerifier(rules) {
        this.rules = rules;
    }
    TokenVerifier.prototype.verify = function (token) {
        return this.rules.every(function (rule) { return rule.verify(token); });
    };
    TokenVerifier.createIdTokenVerifier = function (config, nonce) {
        var rules = [
            new SignatureVerifierRule_1.default(config.publicKeys.idToken),
            new ExpiryRule_1.default(),
            new IssuerRule_1.default(config.issuer),
            new AudienceRule_1.default(config.audience),
        ];
        if (nonce) {
            rules.push(new NonceRule_1.default(nonce));
        }
        return new TokenVerifier(rules);
    };
    TokenVerifier.createTenantTokenVerifier = function (config, nonce) {
        return new TokenVerifier([
            new SignatureVerifierRule_1.default(config.publicKeys.tenantToken),
            new ExpiryRule_1.default(),
            new IssuerRule_1.default(config.issuer),
            new AudienceRule_1.default(config.audience),
            new NonceRule_1.default(nonce),
        ]);
    };
    return TokenVerifier;
}());
exports.default = TokenVerifier;

"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthManager = exports.Role = void 0;
var cross_fetch_1 = __importDefault(require("cross-fetch"));
var nanoid_1 = require("nanoid");
var TokenVerifier_1 = __importStar(require("./token-verifier/TokenVerifier"));
var Token_1 = __importDefault(require("./token-verifier/Token"));
var Role;
(function (Role) {
    Role["admin"] = "admin";
    Role["uploader"] = "uploader";
    Role["editor"] = "editor";
    Role["viewer"] = "viewer";
    Role["reporter"] = "reporter";
    Role["analyst"] = "analyst";
})(Role = exports.Role || (exports.Role = {}));
var AuthManager = /** @class */ (function () {
    function AuthManager(config) {
        this.config = config;
    }
    AuthManager.prototype.login = function (email, password) {
        return __awaiter(this, void 0, void 0, function () {
            var idToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.requestIdToken(email, password)];
                    case 1:
                        idToken = _a.sent();
                        return [4 /*yield*/, this.setIdToken(idToken)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, this.currentUser];
                }
            });
        });
    };
    AuthManager.prototype.chooseTenant = function (tenant) {
        return __awaiter(this, void 0, void 0, function () {
            var tenantUser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.requestTenantToken(tenant)];
                    case 1:
                        tenantUser = _a.sent();
                        return [4 /*yield*/, this.verifyTenantToken(tenantUser.token)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, tenantUser];
                }
            });
        });
    };
    AuthManager.prototype.setIdToken = function (idToken) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.idToken = new Token_1.default(idToken);
                        return [4 /*yield*/, this.verifyIdToken()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Object.defineProperty(AuthManager.prototype, "currentUser", {
        get: function () {
            return this.extractUserFromToken();
        },
        enumerable: false,
        configurable: true
    });
    AuthManager.prototype.requestIdToken = function (email, password) {
        return __awaiter(this, void 0, void 0, function () {
            var response, id_token;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.idTokenNonce = nanoid_1.nanoid();
                        return [4 /*yield*/, cross_fetch_1.default(this.authUrl, {
                                method: 'POST',
                                body: JSON.stringify({
                                    client_id: this.config.clientId,
                                    nonce: this.idTokenNonce,
                                    email: email,
                                    password: password
                                })
                            })];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        id_token = (_a.sent()).id_token;
                        return [2 /*return*/, id_token];
                }
            });
        });
    };
    AuthManager.prototype.verifyIdToken = function () {
        return __awaiter(this, void 0, void 0, function () {
            var tokenVerifier;
            return __generator(this, function (_a) {
                if (!this.idToken) {
                    throw new TokenVerifier_1.TokenVerificationError('Missing id token');
                }
                tokenVerifier = TokenVerifier_1.default.createIdTokenVerifier(this.config, this.idTokenNonce);
                return [2 /*return*/, tokenVerifier.verify(this.idToken)];
            });
        });
    };
    AuthManager.prototype.extractUserFromToken = function () {
        var _a;
        if (!((_a = this.idToken) === null || _a === void 0 ? void 0 : _a.payload.sub)) {
            throw new Error('Missing subject');
        }
        return {
            email: this.idToken.payload.sub,
            tenants: this.idToken.payload["https://www.iot-inspector.com/tenants"] || [],
            token: this.idToken,
        };
    };
    AuthManager.prototype.requestTenantToken = function (tenant) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var response, _b, tenant_token, user_groups, product_groups, roles;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!this.idToken) {
                            throw new Error('Missing id token');
                        }
                        this.tenantTokenNonce = nanoid_1.nanoid();
                        return [4 /*yield*/, cross_fetch_1.default(this.tokenUrl, {
                                method: 'POST',
                                body: JSON.stringify({
                                    client_id: this.config.clientId,
                                    nonce: this.tenantTokenNonce,
                                    id_token: (_a = this.idToken) === null || _a === void 0 ? void 0 : _a.raw,
                                    tenant_id: tenant.id,
                                }),
                            })];
                    case 1:
                        response = _c.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        _b = _c.sent(), tenant_token = _b.tenant_token, user_groups = _b.user_groups, product_groups = _b.product_groups, roles = _b.roles;
                        return [2 /*return*/, {
                                tenant: tenant,
                                token: new Token_1.default(tenant_token),
                                userGroups: user_groups,
                                productGroups: product_groups,
                                roles: roles
                            }];
                }
            });
        });
    };
    AuthManager.prototype.verifyTenantToken = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            var tokenVerifier;
            return __generator(this, function (_a) {
                if (!this.tenantTokenNonce) {
                    throw new TokenVerifier_1.TokenVerificationError('Missing nonce value');
                }
                tokenVerifier = TokenVerifier_1.default.createTenantTokenVerifier(this.config, this.tenantTokenNonce);
                return [2 /*return*/, tokenVerifier.verify(token)];
            });
        });
    };
    Object.defineProperty(AuthManager.prototype, "authUrl", {
        get: function () {
            return this.config.authServerUrl + "/authorize";
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AuthManager.prototype, "tokenUrl", {
        get: function () {
            return this.config.authServerUrl + "/token";
        },
        enumerable: false,
        configurable: true
    });
    return AuthManager;
}());
exports.AuthManager = AuthManager;

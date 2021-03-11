"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultIotAuthConfig = void 0;
var publicKeys_1 = require("./publicKeys");
var defaultIotAuthConfig = function (authServerUrl, clientId) { return ({
    authServerUrl: authServerUrl,
    clientId: clientId,
    audience: 'IotFrontend',
    issuer: 'https://www.iot-inspector.com/',
    publicKeys: {
        idToken: publicKeys_1.ID_TOKEN_PUBLIC_KEY,
        tenantToken: publicKeys_1.TENANT_TOKEN_PUBLIC_KEY,
    }
}); };
exports.defaultIotAuthConfig = defaultIotAuthConfig;

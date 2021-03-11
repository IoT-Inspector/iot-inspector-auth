export interface AuthConfig {
    authServerUrl: string;
    clientId: string;
    audience: string;
    issuer: string;
    publicKeys: {
        idToken: string;
        tenantToken: string;
    };
}
export declare const defaultIotAuthConfig: (authServerUrl: string, clientId: string) => AuthConfig;

import { ID_TOKEN_PUBLIC_KEY, TENANT_TOKEN_PUBLIC_KEY } from "./publicKeys";

export interface AuthConfig {
  authServerUrl: string;
  clientId: string;
  audience: string;
  issuer: string;
  publicKeys: {
    idToken: string;
    tenantToken: string;
  }
}

export const defaultIotAuthConfig = (authServerUrl: string, clientId: string): AuthConfig => ({
  authServerUrl,
  clientId,
  audience: 'IotFrontend',
  issuer: 'https://www.iot-inspector.com/',
  publicKeys: {
    idToken: ID_TOKEN_PUBLIC_KEY,
    tenantToken: TENANT_TOKEN_PUBLIC_KEY,
  }
});

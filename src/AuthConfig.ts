export interface AuthConfig {
  authServerUrl: string;
  clientId: string;
  audience: string;
  issuer: string;
}

export const defaultIotAuthConfig = (authServerUrl: string, clientId: string): AuthConfig => ({
  authServerUrl,
  clientId,
  audience: 'Frontend',
  issuer: 'https://www.iot-inspector.com/',
});

import fetch from "cross-fetch";

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

export const defaultIotAuthConfig = async (
  authServerUrl: string,
  clientId: string
): Promise<AuthConfig> => {
  const idTokenKeyResponse = await fetch(
    `${authServerUrl}/id-token-public-key.pem`
  );
  const tenantTokenKeyResponse = await fetch(
    `${authServerUrl}/tenant-token-public-key.pem`
  );

  return {
    authServerUrl,
    clientId,
    audience: "IotFrontend",
    issuer: "https://www.iot-inspector.com/",
    publicKeys: {
      idToken: await idTokenKeyResponse.text(),
      tenantToken: await tenantTokenKeyResponse.text(),
    },
  };
};

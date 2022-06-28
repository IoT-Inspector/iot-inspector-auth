import tk from 'timekeeper';
import { mocked } from 'ts-jest/utils'
import { nanoid } from 'nanoid';
import { defaultIotAuthConfig, AuthManager, AuthConfig } from '../src';
import { ID_TOKEN, TENANT_TOKEN } from './mocks/handlers';

jest.mock('nanoid');
const mockedNanoid = mocked(nanoid);
mockedNanoid.mockReturnValue('xYnNNBwFHp9e9fG1iJpD3');

let config: AuthConfig;

describe('AuthManager', () => {

  beforeAll(async () => {
    config = await defaultIotAuthConfig('http://mocked-address.com', 'auth');
  });

  describe('login', () => {
    test('returns User when successfully logged in', async () => {
      tk.freeze(1615006347000);
      const authManager = new AuthManager(config);
      const user = await authManager.login('admin@onekey.com', '12345678');
      expect(user).toEqual({
        email: 'admin@onekey.com',
        tenants: [
          {
            name: 'Sharing is Caring Corp.',
            id: '1a9ae586-d53e-486d-8715-686f883c17a6'
          },
          {
            name: 'Tenant One GmbH',
            id: '3d313127-e5df-428d-89d5-4bf009c5e497'
          },
        ],
          token:  {
            payload:  {
              aud: "OnekeyFrontend",
              exp: 1615016347,
              "https://www.onekey.com/is_superuser": true,
              "https://www.onekey.com/tenants":  [
                {
                  id: "1a9ae586-d53e-486d-8715-686f883c17a6",
                  name: "Sharing is Caring Corp.",
                },
                {
                  id: "3d313127-e5df-428d-89d5-4bf009c5e497",
                  name: "Tenant One GmbH",
                },
              ],
              iat: 1614929947,
              iss: "https://www.onekey.com/",
              nonce: "xYnNNBwFHp9e9fG1iJpD3",
              sub: "admin@onekey.com",
            },
            raw: ID_TOKEN,
          },
      });
      tk.reset();
    });

    test('throws error when signature verification fails', async () => {
      expect.assertions(1);
      tk.freeze(1615006347000);
      const authManager = new AuthManager(config);
      try {
        await authManager.login('admin@onekey.com', 'wrong_signature');
      } catch (e) {
        expect(e.message).toEqual('Invalid token signature');
      } finally {
        tk.reset();
      }
    });

    test('throws error when token expired', async () => {
      expect.assertions(1);
      tk.freeze(1616006347000);
      const authManager = new AuthManager(config);
      try {
        await authManager.login('admin@onekey.com', '12345678');
      } catch (e) {
        expect(e.message).toEqual('Token expired');
      } finally {
        tk.reset();
      }
    });

    test('throws error when issuer verification fails', async () => {
      expect.assertions(1);
      tk.freeze(1615006347000);
      const authManager = new AuthManager({...config, issuer: 'configured issuer'});
      try {
        await authManager.login('admin@onekey.com', '12345678');
      } catch (e) {
        expect(e.message).toEqual('Issuer must be configured issuer, got https://www.onekey.com/');
      } finally {
        tk.reset();
      }
    });

    test('throws error when audience verification fails', async () => {
      expect.assertions(1);
      tk.freeze(1615006347000);
      const authManager = new AuthManager({ ...config, audience: 'Frontend' });
      try {
        await authManager.login('admin@onekey.com', '12345678');
      } catch (e) {
        expect(e.message).toEqual('Audience must be Frontend, got OnekeyFrontend');
      } finally {
        tk.reset();
      }
    });

    test('throws error when nonce verification fails', async () => {
      expect.assertions(1);
      tk.freeze(1615006347000);
      mockedNanoid.mockReturnValueOnce('nonce');
      const authManager = new AuthManager(config);
      try {
        await authManager.login('admin@onekey.com', '12345678');
      } catch (e) {
        expect(e.message).toEqual('Nonce must be nonce but it was xYnNNBwFHp9e9fG1iJpD3');
      } finally {
        tk.reset();
      }
    });

    test('throws error when login fails', async () => {
      expect.assertions(1);
      tk.freeze(1615006347000);
      const authManager = new AuthManager(config);
      try {
        await authManager.login('admin@onekey.com', 'wrong_pass');
      } catch (e) {
        expect(e.message).toEqual('Invalid token specified');
      } finally {
        tk.reset();
      }
    });
  });

  describe('setIdToken', () => {
    test('returns User when id token is valid', async () => {
      tk.freeze(1615006347000);
      const authManager = new AuthManager(config);
      await authManager.setIdToken(ID_TOKEN);
      expect(authManager.currentUser).toEqual({
        email: 'admin@onekey.com',
        tenants: [
          {
            name: 'Sharing is Caring Corp.',
            id: '1a9ae586-d53e-486d-8715-686f883c17a6'
          },
          {
            name: 'Tenant One GmbH',
            id: '3d313127-e5df-428d-89d5-4bf009c5e497'
          },
        ],
          token:  {
            payload:  {
              aud: "OnekeyFrontend",
              exp: 1615016347,
              "https://www.onekey.com/is_superuser": true,
              "https://www.onekey.com/tenants":  [
                {
                  id: "1a9ae586-d53e-486d-8715-686f883c17a6",
                  name: "Sharing is Caring Corp.",
                },
                {
                  id: "3d313127-e5df-428d-89d5-4bf009c5e497",
                  name: "Tenant One GmbH",
                },
              ],
              iat: 1614929947,
              iss: "https://www.onekey.com/",
              nonce: "xYnNNBwFHp9e9fG1iJpD3",
              sub: "admin@onekey.com",
            },
            raw: ID_TOKEN,
          },
      });
      tk.reset();
    });

    test('throws error when signature verification fails', async () => {
      expect.assertions(1);
      tk.freeze(1615006347000);
      const authManager = new AuthManager(config);
      try {
        await authManager.setIdToken(`${ID_TOKEN}random`);
      } catch (e) {
        expect(e.message).toEqual('Invalid token signature');
      } finally {
        tk.reset();
      }
    });

    test('throws error when token expired', async () => {
      expect.assertions(1);
      tk.freeze(1616006347000);
      const authManager = new AuthManager(config);
      try {
        await authManager.setIdToken(ID_TOKEN);
      } catch (e) {
        expect(e.message).toEqual('Token expired');
      } finally {
        tk.reset();
      }
    });

    test('throws error when issuer verification fails', async () => {
      expect.assertions(1);
      tk.freeze(1615006347000);
      const authManager = new AuthManager({...config, issuer: 'configured issuer'});
      try {
        await authManager.setIdToken(ID_TOKEN);
      } catch (e) {
        expect(e.message).toEqual('Issuer must be configured issuer, got https://www.onekey.com/');
      } finally {
        tk.reset();
      }
    });

    test('throws error when audience verification fails', async () => {
      expect.assertions(1);
      tk.freeze(1615006347000);
      const authManager = new AuthManager({...config, audience: 'Frontend' });
      try {
        await authManager.setIdToken(ID_TOKEN);
      } catch (e) {
        expect(e.message).toEqual('Audience must be Frontend, got OnekeyFrontend');
      } finally {
        tk.reset();
      }
    });
  });

  describe('chooseTenant', () => {
    test('returns TenantUser when token request was successful', async () => {
      tk.freeze(1614006347000);
      const authManager = new AuthManager(config);
      const user = await authManager.login('admin@onekey.com', '12345678');
      mockedNanoid.mockReturnValueOnce('9dvurU5fvxcLEdyR-zhkp');
      const tenantUser = await authManager.chooseTenant(user.tenants[0]);
      expect(tenantUser).toEqual({
        tenant: {
          id: '1a9ae586-d53e-486d-8715-686f883c17a6',
          name: 'Sharing is Caring Corp.',
        },
        token: {
          raw: TENANT_TOKEN,
          payload: {
            iss: 'https://www.onekey.com/',
            sub: 'admin@onekey.com',
            aud: 'OnekeyFrontend',
            iat: 1614929955,
            exp: 1614965955,
            nonce: '9dvurU5fvxcLEdyR-zhkp',
            'https://www.onekey.com/tenant_id': '1a9ae586-d53e-486d-8715-686f883c17a6'
          }
        },
        userGroups: [ { name: 'User group 1', id: '1' } ],
        productGroups: [ { name: 'Product Group 1', id: '1' } ],
        roles: [ 'admin' ]
      });
      tk.reset();
    });

    test('throws error when id token is missing', async () => {
      expect.assertions(1);
      tk.freeze(1614006347000);
      const authManager = new AuthManager(config);
      try {
        await authManager.chooseTenant({
          name: "Sharing is Caring Corp.",
          id: "1a9ae586-d53e-486d-8715-686f883c17a6"
        });
      } catch (e) {
        expect(e.message).toEqual('Missing id token');
      } finally {
        tk.reset();
      }
    });

    test('throws error when signature verification fails', async () => {
      expect.assertions(1);
      tk.freeze(1614006347000);
      const authManager = new AuthManager(config);
      await authManager.login('admin@onekey.com', '12345678');
      mockedNanoid.mockReturnValueOnce('9dvurU5fvxcLEdyR-zhkp');
      try {
        await authManager.chooseTenant({
          name: "Sharing is Caring Corp.",
          id: "wrong_signature"
        });
      } catch (e) {
        expect(e.message).toEqual('Invalid token signature');
      } finally {
        tk.reset();
      }
    });

    test('throws error when token expired', async () => {
      expect.assertions(1);
      tk.freeze(1615006347000);
      const authManager = new AuthManager(config);
      await authManager.login('admin@onekey.com', '12345678');
      mockedNanoid.mockReturnValueOnce('9dvurU5fvxcLEdyR-zhkp');
      try {
        await authManager.chooseTenant({
          name: "Sharing is Caring Corp.",
          id: "1a9ae586-d53e-486d-8715-686f883c17a6"
        });
      } catch (e) {
        expect(e.message).toEqual('Token expired');
      } finally {
        tk.reset();
      }
    });

    test('throws error when issuer verification fails', async () => {
      expect.assertions(1);
      tk.freeze(1614006347000);
      const authManager = new AuthManager(config);
      await authManager.login('admin@onekey.com', '12345678');
      mockedNanoid.mockReturnValueOnce('9dvurU5fvxcLEdyR-zhkp');
      authManager.config = {...config, issuer: 'configured issuer'};
      try {
        await authManager.chooseTenant({
          name: "Sharing is Caring Corp.",
          id: "1a9ae586-d53e-486d-8715-686f883c17a6"
        });
      } catch (e) {
        expect(e.message).toEqual('Issuer must be configured issuer, got https://www.onekey.com/');
      } finally {
        tk.reset();
      }
    });

    test('throws error when audience verification fails', async () => {
      expect.assertions(1);
      tk.freeze(1614006347000);
      const authManager = new AuthManager(config);
      await authManager.login('admin@onekey.com', '12345678');
      mockedNanoid.mockReturnValueOnce('9dvurU5fvxcLEdyR-zhkp');
      authManager.config = {...config, audience: 'Frontend'};
      try {
        await authManager.chooseTenant({
          name: "Sharing is Caring Corp.",
          id: "1a9ae586-d53e-486d-8715-686f883c17a6"
        });
      } catch (e) {
        expect(e.message).toEqual('Audience must be Frontend, got OnekeyFrontend');
      } finally {
        tk.reset();
      }
    });

    test('throws error when nonce verification fails', async () => {
      expect.assertions(1);
      tk.freeze(1614006347000);
      const authManager = new AuthManager(config);
      await authManager.login('admin@onekey.com', '12345678');
      try {
        await authManager.chooseTenant({
          name: "Sharing is Caring Corp.",
          id: "1a9ae586-d53e-486d-8715-686f883c17a6"
        });
      } catch (e) {
        expect(e.message).toEqual('Nonce must be xYnNNBwFHp9e9fG1iJpD3 but it was 9dvurU5fvxcLEdyR-zhkp');
      } finally {
        tk.reset();
      }
    });
  });
});



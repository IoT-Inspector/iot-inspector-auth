import tk from 'timekeeper';
import { mocked } from 'ts-jest/utils'
import { nanoid } from 'nanoid';
import { defaultIotAuthConfig, AuthManager } from '../src';

jest.mock('nanoid');
const mockedNanoid = mocked(nanoid);
mockedNanoid.mockReturnValue('xYnNNBwFHp9e9fG1iJpD3');

const config = defaultIotAuthConfig('http://mocked-address.com', 'auth');

describe('AuthManager', () => {
  describe('login', () => {
    test('returns User when successfully logged in', async () => {
      tk.freeze(1615006347000);
      const authManager = new AuthManager(config);
      const user = await authManager.login('admin@iot-inspector.com', '12345678');
      expect(user).toEqual({
        email: 'admin@iot-inspector.com',
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
              aud: "IotFrontend",
              exp: 1615016347,
              "https://www.iot-inspector.com/is_superuser": true,
              "https://www.iot-inspector.com/tenants":  [
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
              iss: "https://www.iot-inspector.com/",
              nonce: "xYnNNBwFHp9e9fG1iJpD3",
              sub: "admin@iot-inspector.com",
            },
            raw: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL3d3dy5pb3QtaW5zcGVjdG9yLmNvbS8iLCJzdWIiOiJhZG1pbkBpb3QtaW5zcGVjdG9yLmNvbSIsImF1ZCI6IklvdEZyb250ZW5kIiwiaWF0IjoxNjE0OTI5OTQ3LCJleHAiOjE2MTUwMTYzNDcsIm5vbmNlIjoieFluTk5Cd0ZIcDllOWZHMWlKcEQzIiwiaHR0cHM6Ly93d3cuaW90LWluc3BlY3Rvci5jb20vdGVuYW50cyI6W3sibmFtZSI6IlNoYXJpbmcgaXMgQ2FyaW5nIENvcnAuIiwiaWQiOiIxYTlhZTU4Ni1kNTNlLTQ4NmQtODcxNS02ODZmODgzYzE3YTYifSx7Im5hbWUiOiJUZW5hbnQgT25lIEdtYkgiLCJpZCI6IjNkMzEzMTI3LWU1ZGYtNDI4ZC04OWQ1LTRiZjAwOWM1ZTQ5NyJ9XSwiaHR0cHM6Ly93d3cuaW90LWluc3BlY3Rvci5jb20vaXNfc3VwZXJ1c2VyIjp0cnVlfQ.b-uuWpcfzmjNWcHo3UCQWGWlZqY202u_aHNnz4C6c8saDa0aSSQ2bajbX4wp2JkhZXW8xYae-oMzVxw0fheKBxKeqnqitjfCk5jANmPJpbIxFeDb0cp9mPGzzPj8uyysEDA2Zlpd_BYhU8WbdJhez-HYD8E9TdlTgVeR_LVCjFhcU3qyNVeLjWNeL5-iSUXKyyzpqL6Dq5DJsFCcW_Ap6rIBbqT9cl0h0rGHqhcATB7WymvpNFHSHKbSoCsb7nfSYPjpw5QeysDKffpPCLsUm59zIj4eUBfD51eq6xqEvFE_zOmD26BcftGYs5K9XSAyx3at0HUdOw4xH07Cd5n2NA",
          },
      });
      tk.reset();
    });

    test('throws error when signature verification fails', async () => {
      expect.assertions(1);
      tk.freeze(1615006347000);
      const authManager = new AuthManager(config);
      try {
        await authManager.login('admin@iot-inspector.com', 'wrong_signature');
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
        await authManager.login('admin@iot-inspector.com', '12345678');
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
        await authManager.login('admin@iot-inspector.com', '12345678');
      } catch (e) {
        expect(e.message).toEqual('Issuer must be configured issuer, got https://www.iot-inspector.com/');
      } finally {
        tk.reset();
      }
    });

    test('throws error when audience verification fails', async () => {
      expect.assertions(1);
      tk.freeze(1615006347000);
      const authManager = new AuthManager({ ...config, audience: 'Frontend' });
      try {
        await authManager.login('admin@iot-inspector.com', '12345678');
      } catch (e) {
        expect(e.message).toEqual('Audience must be Frontend, got IotFrontend');
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
        await authManager.login('admin@iot-inspector.com', '12345678');
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
        await authManager.login('admin@iot-inspector.com', 'wrong_pass');
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
      await authManager.setIdToken('eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL3d3dy5pb3QtaW5zcGVjdG9yLmNvbS8iLCJzdWIiOiJhZG1pbkBpb3QtaW5zcGVjdG9yLmNvbSIsImF1ZCI6IklvdEZyb250ZW5kIiwiaWF0IjoxNjE0OTI5OTQ3LCJleHAiOjE2MTUwMTYzNDcsIm5vbmNlIjoieFluTk5Cd0ZIcDllOWZHMWlKcEQzIiwiaHR0cHM6Ly93d3cuaW90LWluc3BlY3Rvci5jb20vdGVuYW50cyI6W3sibmFtZSI6IlNoYXJpbmcgaXMgQ2FyaW5nIENvcnAuIiwiaWQiOiIxYTlhZTU4Ni1kNTNlLTQ4NmQtODcxNS02ODZmODgzYzE3YTYifSx7Im5hbWUiOiJUZW5hbnQgT25lIEdtYkgiLCJpZCI6IjNkMzEzMTI3LWU1ZGYtNDI4ZC04OWQ1LTRiZjAwOWM1ZTQ5NyJ9XSwiaHR0cHM6Ly93d3cuaW90LWluc3BlY3Rvci5jb20vaXNfc3VwZXJ1c2VyIjp0cnVlfQ.b-uuWpcfzmjNWcHo3UCQWGWlZqY202u_aHNnz4C6c8saDa0aSSQ2bajbX4wp2JkhZXW8xYae-oMzVxw0fheKBxKeqnqitjfCk5jANmPJpbIxFeDb0cp9mPGzzPj8uyysEDA2Zlpd_BYhU8WbdJhez-HYD8E9TdlTgVeR_LVCjFhcU3qyNVeLjWNeL5-iSUXKyyzpqL6Dq5DJsFCcW_Ap6rIBbqT9cl0h0rGHqhcATB7WymvpNFHSHKbSoCsb7nfSYPjpw5QeysDKffpPCLsUm59zIj4eUBfD51eq6xqEvFE_zOmD26BcftGYs5K9XSAyx3at0HUdOw4xH07Cd5n2NA');
      expect(authManager.currentUser).toEqual({
        email: 'admin@iot-inspector.com',
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
              aud: "IotFrontend",
              exp: 1615016347,
              "https://www.iot-inspector.com/is_superuser": true,
              "https://www.iot-inspector.com/tenants":  [
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
              iss: "https://www.iot-inspector.com/",
              nonce: "xYnNNBwFHp9e9fG1iJpD3",
              sub: "admin@iot-inspector.com",
            },
            raw: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL3d3dy5pb3QtaW5zcGVjdG9yLmNvbS8iLCJzdWIiOiJhZG1pbkBpb3QtaW5zcGVjdG9yLmNvbSIsImF1ZCI6IklvdEZyb250ZW5kIiwiaWF0IjoxNjE0OTI5OTQ3LCJleHAiOjE2MTUwMTYzNDcsIm5vbmNlIjoieFluTk5Cd0ZIcDllOWZHMWlKcEQzIiwiaHR0cHM6Ly93d3cuaW90LWluc3BlY3Rvci5jb20vdGVuYW50cyI6W3sibmFtZSI6IlNoYXJpbmcgaXMgQ2FyaW5nIENvcnAuIiwiaWQiOiIxYTlhZTU4Ni1kNTNlLTQ4NmQtODcxNS02ODZmODgzYzE3YTYifSx7Im5hbWUiOiJUZW5hbnQgT25lIEdtYkgiLCJpZCI6IjNkMzEzMTI3LWU1ZGYtNDI4ZC04OWQ1LTRiZjAwOWM1ZTQ5NyJ9XSwiaHR0cHM6Ly93d3cuaW90LWluc3BlY3Rvci5jb20vaXNfc3VwZXJ1c2VyIjp0cnVlfQ.b-uuWpcfzmjNWcHo3UCQWGWlZqY202u_aHNnz4C6c8saDa0aSSQ2bajbX4wp2JkhZXW8xYae-oMzVxw0fheKBxKeqnqitjfCk5jANmPJpbIxFeDb0cp9mPGzzPj8uyysEDA2Zlpd_BYhU8WbdJhez-HYD8E9TdlTgVeR_LVCjFhcU3qyNVeLjWNeL5-iSUXKyyzpqL6Dq5DJsFCcW_Ap6rIBbqT9cl0h0rGHqhcATB7WymvpNFHSHKbSoCsb7nfSYPjpw5QeysDKffpPCLsUm59zIj4eUBfD51eq6xqEvFE_zOmD26BcftGYs5K9XSAyx3at0HUdOw4xH07Cd5n2NA",
          },
      });
      tk.reset();
    });

    test('throws error when signature verification fails', async () => {
      expect.assertions(1);
      tk.freeze(1615006347000);
      const authManager = new AuthManager(config);
      try {
        await authManager.setIdToken('eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL3d3dy5pb3QtaW5zcGVjdG9yLmNvbS8iLCJzdWIiOiJhZG1pbkBpb3QtaW5zcGVjdG9yLmNvbSIsImF1ZCI6IklvdEZyb250ZW5kIiwiaWF0IjoxNjE0OTI5OTQ3LCJleHAiOjE2MTUwMTYzNDcsIm5vbmNlIjoieFluTk5Cd0ZIcDllOWZHMWlKcEQzIiwiaHR0cHM6Ly93d3cuaW90LWluc3BlY3Rvci5jb20vdGVuYW50cyI6W3sibmFtZSI6IlNoYXJpbmcgaXMgQ2FyaW5nIENvcnAuIiwiaWQiOiIxYTlhZTU4Ni1kNTNlLTQ4NmQtODcxNS02ODZmODgzYzE3YTYifSx7Im5hbWUiOiJUZW5hbnQgT25lIEdtYkgiLCJpZCI6IjNkMzEzMTI3LWU1ZGYtNDI4ZC04OWQ1LTRiZjAwOWM1ZTQ5NyJ9XSwiaHR0cHM6Ly93d3cuaW90LWluc3BlY3Rvci5jb20vaXNfc3VwZXJ1c2VyIjp0cnVlfQ.b-uuWpcfzmjNWcHo3UCQWGWlZqY202u_aHNnz4C6c8saDa0aSSQ2bajbX4wp2JkhZXW8xYae-oMzVxw0fheKBxKeqnqitjfCk5jANmPJpbIxFeDb0cp9mPGzzPj8uyysEDA2Zlpd_BYhU8WbdJhez-HYD8E9TdlTgVeR_LVCjFhcU3qyNVeLjWNeL5-iSUXKyyzpqL6Dq5DJsFCcW_Ap6rIBbqT9cl0h0rGHqhcATB7WymvpNFHSHKbSoCsb7nfSYPjpw5QeysDKffpPCLsUm59zIj4eUBfD51eq6xqEvFE_zOmD26BcftGYs5K9XSAyx3at0HUdOw4xH07Cd5n2NArandom');
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
        await authManager.setIdToken('eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL3d3dy5pb3QtaW5zcGVjdG9yLmNvbS8iLCJzdWIiOiJhZG1pbkBpb3QtaW5zcGVjdG9yLmNvbSIsImF1ZCI6IklvdEZyb250ZW5kIiwiaWF0IjoxNjE0OTI5OTQ3LCJleHAiOjE2MTUwMTYzNDcsIm5vbmNlIjoieFluTk5Cd0ZIcDllOWZHMWlKcEQzIiwiaHR0cHM6Ly93d3cuaW90LWluc3BlY3Rvci5jb20vdGVuYW50cyI6W3sibmFtZSI6IlNoYXJpbmcgaXMgQ2FyaW5nIENvcnAuIiwiaWQiOiIxYTlhZTU4Ni1kNTNlLTQ4NmQtODcxNS02ODZmODgzYzE3YTYifSx7Im5hbWUiOiJUZW5hbnQgT25lIEdtYkgiLCJpZCI6IjNkMzEzMTI3LWU1ZGYtNDI4ZC04OWQ1LTRiZjAwOWM1ZTQ5NyJ9XSwiaHR0cHM6Ly93d3cuaW90LWluc3BlY3Rvci5jb20vaXNfc3VwZXJ1c2VyIjp0cnVlfQ.b-uuWpcfzmjNWcHo3UCQWGWlZqY202u_aHNnz4C6c8saDa0aSSQ2bajbX4wp2JkhZXW8xYae-oMzVxw0fheKBxKeqnqitjfCk5jANmPJpbIxFeDb0cp9mPGzzPj8uyysEDA2Zlpd_BYhU8WbdJhez-HYD8E9TdlTgVeR_LVCjFhcU3qyNVeLjWNeL5-iSUXKyyzpqL6Dq5DJsFCcW_Ap6rIBbqT9cl0h0rGHqhcATB7WymvpNFHSHKbSoCsb7nfSYPjpw5QeysDKffpPCLsUm59zIj4eUBfD51eq6xqEvFE_zOmD26BcftGYs5K9XSAyx3at0HUdOw4xH07Cd5n2NA');
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
        await authManager.setIdToken('eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL3d3dy5pb3QtaW5zcGVjdG9yLmNvbS8iLCJzdWIiOiJhZG1pbkBpb3QtaW5zcGVjdG9yLmNvbSIsImF1ZCI6IklvdEZyb250ZW5kIiwiaWF0IjoxNjE0OTI5OTQ3LCJleHAiOjE2MTUwMTYzNDcsIm5vbmNlIjoieFluTk5Cd0ZIcDllOWZHMWlKcEQzIiwiaHR0cHM6Ly93d3cuaW90LWluc3BlY3Rvci5jb20vdGVuYW50cyI6W3sibmFtZSI6IlNoYXJpbmcgaXMgQ2FyaW5nIENvcnAuIiwiaWQiOiIxYTlhZTU4Ni1kNTNlLTQ4NmQtODcxNS02ODZmODgzYzE3YTYifSx7Im5hbWUiOiJUZW5hbnQgT25lIEdtYkgiLCJpZCI6IjNkMzEzMTI3LWU1ZGYtNDI4ZC04OWQ1LTRiZjAwOWM1ZTQ5NyJ9XSwiaHR0cHM6Ly93d3cuaW90LWluc3BlY3Rvci5jb20vaXNfc3VwZXJ1c2VyIjp0cnVlfQ.b-uuWpcfzmjNWcHo3UCQWGWlZqY202u_aHNnz4C6c8saDa0aSSQ2bajbX4wp2JkhZXW8xYae-oMzVxw0fheKBxKeqnqitjfCk5jANmPJpbIxFeDb0cp9mPGzzPj8uyysEDA2Zlpd_BYhU8WbdJhez-HYD8E9TdlTgVeR_LVCjFhcU3qyNVeLjWNeL5-iSUXKyyzpqL6Dq5DJsFCcW_Ap6rIBbqT9cl0h0rGHqhcATB7WymvpNFHSHKbSoCsb7nfSYPjpw5QeysDKffpPCLsUm59zIj4eUBfD51eq6xqEvFE_zOmD26BcftGYs5K9XSAyx3at0HUdOw4xH07Cd5n2NA');
      } catch (e) {
        expect(e.message).toEqual('Issuer must be configured issuer, got https://www.iot-inspector.com/');
      } finally {
        tk.reset();
      }
    });

    test('throws error when audience verification fails', async () => {
      expect.assertions(1);
      tk.freeze(1615006347000);
      const authManager = new AuthManager({...config, audience: 'Frontend' });
      try {
        await authManager.setIdToken('eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL3d3dy5pb3QtaW5zcGVjdG9yLmNvbS8iLCJzdWIiOiJhZG1pbkBpb3QtaW5zcGVjdG9yLmNvbSIsImF1ZCI6IklvdEZyb250ZW5kIiwiaWF0IjoxNjE0OTI5OTQ3LCJleHAiOjE2MTUwMTYzNDcsIm5vbmNlIjoieFluTk5Cd0ZIcDllOWZHMWlKcEQzIiwiaHR0cHM6Ly93d3cuaW90LWluc3BlY3Rvci5jb20vdGVuYW50cyI6W3sibmFtZSI6IlNoYXJpbmcgaXMgQ2FyaW5nIENvcnAuIiwiaWQiOiIxYTlhZTU4Ni1kNTNlLTQ4NmQtODcxNS02ODZmODgzYzE3YTYifSx7Im5hbWUiOiJUZW5hbnQgT25lIEdtYkgiLCJpZCI6IjNkMzEzMTI3LWU1ZGYtNDI4ZC04OWQ1LTRiZjAwOWM1ZTQ5NyJ9XSwiaHR0cHM6Ly93d3cuaW90LWluc3BlY3Rvci5jb20vaXNfc3VwZXJ1c2VyIjp0cnVlfQ.b-uuWpcfzmjNWcHo3UCQWGWlZqY202u_aHNnz4C6c8saDa0aSSQ2bajbX4wp2JkhZXW8xYae-oMzVxw0fheKBxKeqnqitjfCk5jANmPJpbIxFeDb0cp9mPGzzPj8uyysEDA2Zlpd_BYhU8WbdJhez-HYD8E9TdlTgVeR_LVCjFhcU3qyNVeLjWNeL5-iSUXKyyzpqL6Dq5DJsFCcW_Ap6rIBbqT9cl0h0rGHqhcATB7WymvpNFHSHKbSoCsb7nfSYPjpw5QeysDKffpPCLsUm59zIj4eUBfD51eq6xqEvFE_zOmD26BcftGYs5K9XSAyx3at0HUdOw4xH07Cd5n2NA');
      } catch (e) {
        expect(e.message).toEqual('Audience must be Frontend, got IotFrontend');
      } finally {
        tk.reset();
      }
    });
  });

  describe('chooseTenant', () => {
    test('returns TenantUser when token request was successful', async () => {
      tk.freeze(1614006347000);
      const authManager = new AuthManager(config);
      const user = await authManager.login('admin@iot-inspector.com', '12345678');
      mockedNanoid.mockReturnValueOnce('9dvurU5fvxcLEdyR-zhkp');
      const tenantUser = await authManager.chooseTenant(user.tenants[0]);
      expect(tenantUser).toEqual({
        tenant: {
          id: '1a9ae586-d53e-486d-8715-686f883c17a6',
          name: 'Sharing is Caring Corp.',
        },
        token: {
          raw: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL3d3dy5pb3QtaW5zcGVjdG9yLmNvbS8iLCJzdWIiOiJhZG1pbkBpb3QtaW5zcGVjdG9yLmNvbSIsImF1ZCI6IklvdEZyb250ZW5kIiwiaWF0IjoxNjE0OTI5OTU1LCJleHAiOjE2MTQ5NjU5NTUsIm5vbmNlIjoiOWR2dXJVNWZ2eGNMRWR5Ui16aGtwIiwiaHR0cHM6Ly93d3cuaW90LWluc3BlY3Rvci5jb20vdGVuYW50X2lkIjoiMWE5YWU1ODYtZDUzZS00ODZkLTg3MTUtNjg2Zjg4M2MxN2E2In0.dCM8Vbb_99dPbFWLjrzAy4OXA3ZR11-Sg7HPNgQ3sEZtBXQDFR5ap4wHzPKunU5ovBZkB0T_4CoKbJKCN7BHzCEMDxpBdGZ0Ku8iqN5B6IpgJ2cHHabPztuwaDEmz3xZzZvoV4qdUERB9wv14o8MjanxJTTZ59GeyfOAks9HuToJQlyGtzoB5CxMIWTOMEMGNyvOUyhAew1EXQYclwsGcCsZFufiiJRaSeGOU_BMMmvoVVT9weLQXC0L-jf4OVaJVaS9n6YyNy_cdkG6jOqqUJBIhAgOcEaX-CI5TrnnspAuQmXxZxktBRpLFKRw2WhxiZIvmyMPS4JelDkIrstZ3Q',
          payload: {
            iss: 'https://www.iot-inspector.com/',
            sub: 'admin@iot-inspector.com',
            aud: 'IotFrontend',
            iat: 1614929955,
            exp: 1614965955,
            nonce: '9dvurU5fvxcLEdyR-zhkp',
            'https://www.iot-inspector.com/tenant_id': '1a9ae586-d53e-486d-8715-686f883c17a6'
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
      await authManager.login('admin@iot-inspector.com', '12345678');
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
      await authManager.login('admin@iot-inspector.com', '12345678');
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
      await authManager.login('admin@iot-inspector.com', '12345678');
      mockedNanoid.mockReturnValueOnce('9dvurU5fvxcLEdyR-zhkp');
      authManager.config = {...config, issuer: 'configured issuer'};
      try {
        await authManager.chooseTenant({
          name: "Sharing is Caring Corp.",
          id: "1a9ae586-d53e-486d-8715-686f883c17a6"
        });
      } catch (e) {
        expect(e.message).toEqual('Issuer must be configured issuer, got https://www.iot-inspector.com/');
      } finally {
        tk.reset();
      }
    });

    test('throws error when audience verification fails', async () => {
      expect.assertions(1);
      tk.freeze(1614006347000);
      const authManager = new AuthManager(config);
      await authManager.login('admin@iot-inspector.com', '12345678');
      mockedNanoid.mockReturnValueOnce('9dvurU5fvxcLEdyR-zhkp');
      authManager.config = {...config, audience: 'Frontend'};
      try {
        await authManager.chooseTenant({
          name: "Sharing is Caring Corp.",
          id: "1a9ae586-d53e-486d-8715-686f883c17a6"
        });
      } catch (e) {
        expect(e.message).toEqual('Audience must be Frontend, got IotFrontend');
      } finally {
        tk.reset();
      }
    });

    test('throws error when nonce verification fails', async () => {
      expect.assertions(1);
      tk.freeze(1614006347000);
      const authManager = new AuthManager(config);
      await authManager.login('admin@iot-inspector.com', '12345678');
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



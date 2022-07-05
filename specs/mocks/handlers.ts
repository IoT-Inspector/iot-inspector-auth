import { ResponseComposition, rest, RestContext } from 'msw'
import { ID_TOKEN_PUBLIC_KEY, TENANT_TOKEN_PUBLIC_KEY } from './publicKeys';

export const ID_TOKEN = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL3d3dy5pb3QtaW5zcGVjdG9yLmNvbS8iLCJzdWIiOiJhZG1pbkBpb3QtaW5zcGVjdG9yLmNvbSIsImF1ZCI6IklvdEZyb250ZW5kIiwiaWF0IjoxNjE0OTI5OTQ3LCJleHAiOjE2MTUwMTYzNDcsIm5vbmNlIjoieFluTk5Cd0ZIcDllOWZHMWlKcEQzIiwiaHR0cHM6Ly93d3cuaW90LWluc3BlY3Rvci5jb20vdGVuYW50cyI6W3sibmFtZSI6IlNoYXJpbmcgaXMgQ2FyaW5nIENvcnAuIiwiaWQiOiIxYTlhZTU4Ni1kNTNlLTQ4NmQtODcxNS02ODZmODgzYzE3YTYifSx7Im5hbWUiOiJUZW5hbnQgT25lIEdtYkgiLCJpZCI6IjNkMzEzMTI3LWU1ZGYtNDI4ZC04OWQ1LTRiZjAwOWM1ZTQ5NyJ9XSwiaHR0cHM6Ly93d3cuaW90LWluc3BlY3Rvci5jb20vaXNfc3VwZXJ1c2VyIjp0cnVlfQ.b-uuWpcfzmjNWcHo3UCQWGWlZqY202u_aHNnz4C6c8saDa0aSSQ2bajbX4wp2JkhZXW8xYae-oMzVxw0fheKBxKeqnqitjfCk5jANmPJpbIxFeDb0cp9mPGzzPj8uyysEDA2Zlpd_BYhU8WbdJhez-HYD8E9TdlTgVeR_LVCjFhcU3qyNVeLjWNeL5-iSUXKyyzpqL6Dq5DJsFCcW_Ap6rIBbqT9cl0h0rGHqhcATB7WymvpNFHSHKbSoCsb7nfSYPjpw5QeysDKffpPCLsUm59zIj4eUBfD51eq6xqEvFE_zOmD26BcftGYs5K9XSAyx3at0HUdOw4xH07Cd5n2NA';
export const TENANT_TOKEN = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL3d3dy5pb3QtaW5zcGVjdG9yLmNvbS8iLCJzdWIiOiJhZG1pbkBpb3QtaW5zcGVjdG9yLmNvbSIsImF1ZCI6IklvdEZyb250ZW5kIiwiaWF0IjoxNjE0OTI5OTU1LCJleHAiOjE2MTQ5NjU5NTUsIm5vbmNlIjoiOWR2dXJVNWZ2eGNMRWR5Ui16aGtwIiwiaHR0cHM6Ly93d3cuaW90LWluc3BlY3Rvci5jb20vdGVuYW50X2lkIjoiMWE5YWU1ODYtZDUzZS00ODZkLTg3MTUtNjg2Zjg4M2MxN2E2In0.dCM8Vbb_99dPbFWLjrzAy4OXA3ZR11-Sg7HPNgQ3sEZtBXQDFR5ap4wHzPKunU5ovBZkB0T_4CoKbJKCN7BHzCEMDxpBdGZ0Ku8iqN5B6IpgJ2cHHabPztuwaDEmz3xZzZvoV4qdUERB9wv14o8MjanxJTTZ59GeyfOAks9HuToJQlyGtzoB5CxMIWTOMEMGNyvOUyhAew1EXQYclwsGcCsZFufiiJRaSeGOU_BMMmvoVVT9weLQXC0L-jf4OVaJVaS9n6YyNy_cdkG6jOqqUJBIhAgOcEaX-CI5TrnnspAuQmXxZxktBRpLFKRw2WhxiZIvmyMPS4JelDkIrstZ3Q';

export const tenantSharingCorp = {
  name: "Sharing is Caring Corp.",
  id: "1a9ae586-d53e-486d-8715-686f883c17a6"
};

export const tenantOneGmbh = {
  name: "Tenant One GmbH",
  id: "3d313127-e5df-428d-89d5-4bf009c5e497"
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const errorResponses = (client_id: string, res: ResponseComposition<any>, ctx: RestContext) => {
  if (client_id === 'unprocessable_entity') {
    return res(
      ctx.status(422),
      ctx.json({
        errors: [
          {
            type: "string",
            detail: "string",
            location: [
              "string"
            ]
          }
        ]
      })
    );
  }
  if (client_id === 'internal_server_error') {
    return res(
      ctx.status(500),
      ctx.json(
        {
          errors: [
            {
              type: "auth.unknown",
              detail: "Unknown error during authentication, please try again later!"
            }
          ]
        }
      )
    );
  }
  return res(
    ctx.status(502),
    ctx.json(
      {
        errors: [
          {
            type: "auth.unavailable",
            detail: "Authentication server unavailable, please try again in a couple of minutes!"
          }
        ]
      }
    )
  );
}

export const handlers = [
  rest.post<string>('http://mocked-address.com/authorize', (req, res, ctx) => {
  const { client_id, email, password } = req.body as never;

    if (client_id === 'auth') {
      if (email === 'admin@onekey.com' && password === '12345678') {
        return res(
          ctx.status(200),
          ctx.json({
            id_token: ID_TOKEN,
          }),
        );
      }
      if (email === 'admin@onekey.com' && password === 'wrong_signature') {
        return res(
          ctx.status(200),
          ctx.json({
            id_token: `${ID_TOKEN}random`,
          }),
        );
      }
      return res(
        ctx.status(401),
        ctx.json({
          errors: [
            {
              type: 'auth.failed',
              detail: 'Authentication failed, invalid credentials!'
            }
          ]
        })
      );
    }
    return errorResponses(client_id, res, ctx);
  }),
  rest.post<string>('http://mocked-address.com/token', (req, res, ctx) => {
    const { client_id, id_token, tenant_id } = req.body as never;
    if (client_id == 'auth') {
      if (id_token === ID_TOKEN && tenant_id === tenantSharingCorp.id) {
        return res(
          ctx.status(200),
          ctx.json({
            tenant_token: TENANT_TOKEN,
            user_groups: [
              {
                name: 'User group 1',
                id: '1'
              }
            ],
            product_groups: [
              {
                name: 'Product Group 1',
                id: '1'
              }
            ],
            roles: ['admin']
          })
        )
      }
      if (id_token === ID_TOKEN && tenant_id === 'wrong_signature') {
        return res(
          ctx.status(200),
          ctx.json({
            tenant_token: `${TENANT_TOKEN}random`,
            user_groups: [
              {
                name: 'User group 1',
                id: '1'
              }
            ],
            product_groups: [
              {
                name: 'Product Group 1',
                id: '1'
              }
            ],
            roles: ['admin']
          })
        )
      }
      return res(
        ctx.status(401),
        ctx.json({
          errors: [
            {
              type: "auth.failed",
              detail: "Authentication failed, invalid credentials!"
            }
          ]
        })
      );
    }
    return errorResponses(client_id, res, ctx);
  }),
  rest.get('http://mocked-address.com/id-token-public-key.pem', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.text(ID_TOKEN_PUBLIC_KEY)
    );
  }),
  rest.get('http://mocked-address.com/tenant-token-public-key.pem', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.text(TENANT_TOKEN_PUBLIC_KEY)
    );
  }),
];
import { ResponseComposition, rest, RestContext } from 'msw'
import { ID_TOKEN_PUBLIC_KEY, TENANT_TOKEN_PUBLIC_KEY } from './publicKeys';

export const ID_TOKEN = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL3d3dy5vbmVrZXkuY29tLyIsInN1YiI6ImFkbWluQG9uZWtleS5jb20iLCJhdWQiOiJPbmVrZXlGcm9udGVuZCIsImlhdCI6MTYxNDkyOTk0NywiZXhwIjoxNjE1MDE2MzQ3LCJub25jZSI6InhZbk5OQndGSHA5ZTlmRzFpSnBEMyIsImh0dHBzOi8vd3d3Lm9uZWtleS5jb20vdGVuYW50cyI6W3sibmFtZSI6IlNoYXJpbmcgaXMgQ2FyaW5nIENvcnAuIiwiaWQiOiIxYTlhZTU4Ni1kNTNlLTQ4NmQtODcxNS02ODZmODgzYzE3YTYifSx7Im5hbWUiOiJUZW5hbnQgT25lIEdtYkgiLCJpZCI6IjNkMzEzMTI3LWU1ZGYtNDI4ZC04OWQ1LTRiZjAwOWM1ZTQ5NyJ9XSwiaHR0cHM6Ly93d3cub25la2V5LmNvbS9pc19zdXBlcnVzZXIiOnRydWV9.K0TY3Nz_Y-bX2WGZxTaiogX0JNQZ_LmHLrintxE3V_Dx1fso2DQP9qrJ2oAMW-TUqgxDWMtcjDXI5WkBcprycHlRuGf7n220ubghbYCjBGJf64r0bw9vs8zoLcz6CV8aJtM-QcEcQ4Q_ZNiBAmu8ibS49RywD0lmm1Zg2w8c1yenMSEMKFPLmiXBSm8aapJ9CHH5H8tCXlCHlQ5x9FJbUoJYyGYXl_SsezGQSk9DXlosK3jYUPB1oOVuNtH_vupm3hGovuPK1HROP-tiN9Mwjk4feguMRGclMQbmsXOmqtNAssX_lzejbJmYBHZlYb11ChB97vT1mHizh4FPu_slNw';
export const TENANT_TOKEN = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL3d3dy5vbmVrZXkuY29tLyIsInN1YiI6ImFkbWluQG9uZWtleS5jb20iLCJhdWQiOiJPbmVrZXlGcm9udGVuZCIsImlhdCI6MTYxNDkyOTk1NSwiZXhwIjoxNjE0OTY1OTU1LCJub25jZSI6IjlkdnVyVTVmdnhjTEVkeVItemhrcCIsImh0dHBzOi8vd3d3Lm9uZWtleS5jb20vdGVuYW50X2lkIjoiMWE5YWU1ODYtZDUzZS00ODZkLTg3MTUtNjg2Zjg4M2MxN2E2In0.EEdY6IGaGBlAMiQrsSWPobAh4zxiY4gAOEiNW1mH9yh2zQyM-uxvzVqvaE05Up0vzJ0HGLFEC8T320erKpicsqU9CKl2keH6V2U5wl_WPL-dwLRFqDJKIjaA4mf18Pwee_3W4MdmjRAqNZCC-ZEWjMyf3a-yVXphuf2Ux2kFML2mZ8JcrU0cL3VUzlGgYDkDGQf6jRDZ4ErtxV4fyQGmx-wNH_WJZATWGaL5U2SRRbgIHKkNEyeqmDkO7SfhpZ1-XJcnvlz3PrfTGa7pHPKXDuLWMTnsmDWUdKQkJ9kRxF7c0LWRQYCz-MRFRz-dZ3V-U0_4aMLvl-0LT5Ro-mUu9w';

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
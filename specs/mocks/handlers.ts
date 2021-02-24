import { ResponseComposition, rest, RestContext } from 'msw'

export const ID_TOKEN = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL3d3dy5pb3QtaW5zcGVjdG9yLmNvbS8iLCJzdWIiOiJhbmFseXN0QGxvY2FsaG9zdCIsImF1ZCI6IlZTQ29kZSIsImlhdCI6MTYxMzczMzQ0MCwiZXhwIjoxNjEzODE5ODQwLCJub25jZSI6InNvbWVyYW5kb21naWJiZXJpc2giLCJodHRwczovL3d3dy5pb3QtaW5zcGVjdG9yLmNvbS90ZW5hbnRzIjpbeyJuYW1lIjoiU2hhcmluZyBpcyBDYXJpbmcgQ29ycC4iLCJpZCI6IjM4NGZkYmRhLTUwMzktNGQ3Ny1iMzM1LTJhNDMyNDQ5YzMyOCJ9LHsibmFtZSI6IlRlbmFudCBPbmUgR21iSCIsImlkIjoiZmRjZmEyMzktODcyNS00ZjRiLTg5YWEtZTViMGJjYzQzYmYxIn1dLCJodHRwczovL3d3dy5pb3QtaW5zcGVjdG9yLmNvbS9pc19zdXBlcnVzZXIiOmZhbHNlfQ.TLeAUNFfIudlnmeWScBr0v6EMmtPfJfq7Wft5ymVD9u5tFd355CNwsKZWO_yX0bgQXIBi-rIPjjyMYuYZ22u8S01-Y8sSEN2h5IDeQt3k6s5hTl7mfSAMX70qAtLXz7b2A1ekwhKK5TLA9uzW7mkvgKQlF9cT5Z4QFqyp-D6xQA8dl3jv0Dq3B0BmLjFD0AI9do6Ci1t20LBhTJ36tq2lO_y6LVi6kW2zu519VclxnL44HnCUrC6t9ZMW9kEb7iRzFGyroi901lsU-MU7obbfjDGHps06NjLwen8H9lO7aqY6J-1zpHMRCApz6Ez-Mqoe2tiTPAEWM0WkXIMVpEgiA';
export const TENANT_TOKEN = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL3d3dy5pb3QtaW5zcGVjdG9yLmNvbS8iLCJzdWIiOiJhbmFseXN0QGxvY2FsaG9zdCIsImF1ZCI6IndhbGttYW4iLCJpYXQiOjE2MTM3MzM3NzgsImV4cCI6MTcxMzczMzc3Nywibm9uY2UiOiJrdWxkb2ttYXJ2YWxhbWl0aG9neWxlZ3llbiIsImh0dHBzOi8vd3d3LmlvdC1pbnNwZWN0b3IuY29tL3RlbmFudF9pZCI6IjM4NGZkYmRhLTUwMzktNGQ3Ny1iMzM1LTJhNDMyNDQ5YzMyOCJ9.wcZLEqteAT0kH64oPK1MO8SsaxKqKmBvUIISKOcBlBu-r4e1EnmPxXW-FmK2bZesaM6W5lSfx66_qENsbvOhvX5FLGiOkPbQ8AkmDx-AiLRp0DcwP-ACNQ6nz-tvKCJBKI9Ilc9c1FN201r-34q8Pu24Yi5BKZaduUh-SqeMSmX3CscKHpwEIjGUhsG9Nc4D55h4N9-NOU_bZheGsx8lRV60HsSe9AfZmtSrehbV_LSH6ehSCH8QUYR-VBKglD6WjExZv3o9dn1Lug2w6k3BCLTfeR1CQOITdT93wBBue_W9QptiAdWdGQPYDOY0G8SBN71ZAO0-qjKWdkmYdNaJ4w';

export const tenantSharingCorp = {
  name: "Sharing is Caring Corp.",
  id: "384fdbda-5039-4d77-b335-2a432449c328"
};

export const tenantOneGmbh = {
  name: "Tenant One GmbH",
  id: "fdcfa239-8725-4f4b-89aa-e5b0bcc43bf1"
};

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
  rest.post<string>('http://localhost/authorize', (req, res, ctx) => {
    const { client_id, email, password } = JSON.parse(req.body);

    if (client_id === 'auth') {
      if (email === 'analyst@localhost' && password === '12345678') {
        return res(
          ctx.status(200),
          ctx.json({
            id_token: ID_TOKEN,
          }),
        );
      }
      if (email === 'analyst@localhost' && password === 'wrong_signature') {
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
  rest.post<string>('http://localhost/token', (req, res, ctx) => {
    const { client_id, id_token, tenant_id } = JSON.parse(req.body);
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
];
## Package Manager

The project uses [pnpm](https://pnpm.js.org/) for package management.

```bash
npm install -g pnpm
```

## Installation

Add the following to your `package.json` as dependency:

```json
{
  "dependencies": {
    "iot-inspector-auth": "^1.0.0"
  },
  "devDependencies": {
    "@types/jws": "^3.2.3"
  }
}
```

You'll need global typescipt, otherwise the auth lib can not be compiled.
```bash
npm install -g typescript
```

The `@types/jws` dev dependency is reguired becuase the lib will be compiled after the install. Once the lib is publised on npm, this can be removed.

## Usage

```typescript
import {
  AuthConfig,
  AuthManager,
  defaultIotAuthConfig,
} from 'iot-inspector-auth';

const config = defaultIotAuthConfig('your auth server url', 'your client id');

const authManager = new AuthManager(config);

const user = await authManager.login('email', 'password');
const tenantUser = await authManager.chooseTenant('tenant id');
```

Sample user after login:

```javascript
{
  email: 'analyst@localhost',
  tenants: [
    {
      name: 'Sharing is Caring Corp.',
      id: '384fdbda-5039-4d77-b335-2a432449c328'
    },
    {
      name: 'Tenant One GmbH',
      id: 'fdcfa239-8725-4f4b-89aa-e5b0bcc43bf1'
    }
  ]
}
```

Sample tenant user:

```javascript
{
  token: {
    raw: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL3d3dy5pb3QtaW5zcGVjdG9yLmNvbS8iLCJzdWIiOiJhbmFseXN0QGxvY2FsaG9zdCIsImF1ZCI6IndhbGttYW4iLCJpYXQiOjE2MTM3MzM3NzgsImV4cCI6MTcxMzczMzc3Nywibm9uY2UiOiJrdWxkb2ttYXJ2YWxhbWl0aG9neWxlZ3llbiIsImh0dHBzOi8vd3d3LmlvdC1pbnNwZWN0b3IuY29tL3RlbmFudF9pZCI6IjM4NGZkYmRhLTUwMzktNGQ3Ny1iMzM1LTJhNDMyNDQ5YzMyOCJ9.wcZLEqteAT0kH64oPK1MO8SsaxKqKmBvUIISKOcBlBu-r4e1EnmPxXW-FmK2bZesaM6W5lSfx66_qENsbvOhvX5FLGiOkPbQ8AkmDx-AiLRp0DcwP-ACNQ6nz-tvKCJBKI9Ilc9c1FN201r-34q8Pu24Yi5BKZaduUh-SqeMSmX3CscKHpwEIjGUhsG9Nc4D55h4N9-NOU_bZheGsx8lRV60HsSe9AfZmtSrehbV_LSH6ehSCH8QUYR-VBKglD6WjExZv3o9dn1Lug2w6k3BCLTfeR1CQOITdT93wBBue_W9QptiAdWdGQPYDOY0G8SBN71ZAO0-qjKWdkmYdNaJ4w',
    payload: {
      iss: 'https://www.iot-inspector.com/',
      sub: 'analyst@localhost',
      aud: 'walkman',
      iat: 1613733778,
      exp: 1713733777,
      nonce: 'random nonce value',
      'https://www.iot-inspector.com/tenant_id': '384fdbda-5039-4d77-b335-2a432449c328'
    }
  },
  userGroups: [ { name: 'User group 1', id: '1' } ],
  productGroups: [ { name: 'Product Group 1', id: '1' } ],
  roles: [ 'admin' ]
}
```

## Development

Install the dependencies

```bash
pnpm install
```

Run the tests

```bash
pnpm test
```

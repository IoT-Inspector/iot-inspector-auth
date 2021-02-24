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
    "iot-inspector-auth": "git+ssh://git@gitlab.p92.hu/iot-inspector/iot-inspector-auth.git#master"
  },
  "devDependencies": {
    "@types/jws": "^3.2.3"
  }
}
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

## Development

Install the dependencies

```bash
pnpm install
```

Run the tests

```bash
pnpm test
```

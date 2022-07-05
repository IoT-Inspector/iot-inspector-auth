import { AuthConfig } from "./AuthConfig";
import fetch from "cross-fetch";
import { nanoid } from "nanoid";
import TokenVerifier, {
  TokenVerificationError,
} from "./token-verifier/TokenVerifier";
import Token from "./token-verifier/Token";

export interface Tenant {
  id: string;
  name: string;
}

export interface User {
  email: string;
  tenants: Array<Tenant>;
  token?: Token;
}

export interface UserGroup {
  id: string;
  name: string;
}

export interface ProductGroup {
  id: string;
  name: string;
}

export enum Role {
  admin = "admin",
  uploader = "uploader",
  editor = "editor",
  viewer = "viewer",
  reporter = "reporter",
  analyst = "analyst",
}

export interface TenantUser {
  tenant: Tenant;
  token: Token;
  userGroups: Array<UserGroup>;
  productGroups: Array<ProductGroup>;
  roles: Array<Role>;
}

export class AuthManager {
  public config: AuthConfig;
  private idToken?: Token;
  private idTokenNonce?: string;
  private tenantTokenNonce?: string;

  constructor(config: AuthConfig) {
    this.config = config;
  }

  async login(email: string, password: string): Promise<User> {
    const idToken = await this.requestIdToken(email, password);
    await this.setIdToken(idToken);
    return this.currentUser;
  }

  async chooseTenant(tenant: Tenant): Promise<TenantUser> {
    const tenantUser = await this.requestTenantToken(tenant);
    await this.verifyTenantToken(tenantUser.token);
    return tenantUser;
  }

  async setIdToken(idToken: string): Promise<void> {
    this.idToken = new Token(idToken);
    await this.verifyIdToken();
  }

  get currentUser(): User {
    return this.extractUserFromToken();
  }

  private async requestIdToken(
    email: string,
    password: string
  ): Promise<string> {
    this.idTokenNonce = nanoid();
    const response = await fetch(this.authUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        client_id: this.config.clientId,
        nonce: this.idTokenNonce,
        email,
        password,
      }),
    });
    const { id_token } = await response.json();
    return id_token;
  }

  private async verifyIdToken() {
    if (!this.idToken) {
      throw new TokenVerificationError("Missing id token");
    }

    const tokenVerifier = TokenVerifier.createIdTokenVerifier(
      this.config,
      this.idTokenNonce
    );
    return tokenVerifier.verify(this.idToken);
  }

  private extractUserFromToken(): User {
    if (!this.idToken?.payload.sub) {
      throw new Error("Missing subject");
    }
    return {
      email: this.idToken.payload.sub,
      tenants:
        this.idToken.payload["https://www.onekey.com/tenants"] || [],
      token: this.idToken,
    };
  }

  private async requestTenantToken(tenant: Tenant): Promise<TenantUser> {
    if (!this.idToken) {
      throw new Error("Missing id token");
    }
    this.tenantTokenNonce = nanoid();
    const response = await fetch(this.tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        client_id: this.config.clientId,
        nonce: this.tenantTokenNonce,
        id_token: this.idToken?.raw,
        tenant_id: tenant.id,
      }),
    });
    const {
      tenant_token,
      user_groups,
      product_groups,
      roles,
    } = await response.json();
    return {
      tenant,
      token: new Token(tenant_token),
      userGroups: user_groups,
      productGroups: product_groups,
      roles: roles,
    };
  }

  private async verifyTenantToken(token: Token) {
    if (!this.tenantTokenNonce) {
      throw new TokenVerificationError("Missing nonce value");
    }

    const tokenVerifier = TokenVerifier.createTenantTokenVerifier(
      this.config,
      this.tenantTokenNonce
    );
    return tokenVerifier.verify(token);
  }

  private get authUrl() {
    return `${this.config.authServerUrl}/authorize`;
  }

  private get tokenUrl() {
    return `${this.config.authServerUrl}/token`;
  }
}

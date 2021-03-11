import { AuthConfig } from "./AuthConfig";
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
export declare enum Role {
    admin = "admin",
    uploader = "uploader",
    editor = "editor",
    viewer = "viewer",
    reporter = "reporter",
    analyst = "analyst"
}
export interface TenantUser {
    tenant: Tenant;
    token: Token;
    userGroups: Array<UserGroup>;
    productGroups: Array<ProductGroup>;
    roles: Array<Role>;
}
export declare class AuthManager {
    config: AuthConfig;
    private idToken?;
    private idTokenNonce?;
    private tenantTokenNonce?;
    constructor(config: AuthConfig);
    login(email: string, password: string): Promise<User>;
    chooseTenant(tenant: Tenant): Promise<TenantUser>;
    setIdToken(idToken: string): Promise<void>;
    get currentUser(): User;
    private requestIdToken;
    private verifyIdToken;
    private extractUserFromToken;
    private requestTenantToken;
    private verifyTenantToken;
    private get authUrl();
    private get tokenUrl();
}

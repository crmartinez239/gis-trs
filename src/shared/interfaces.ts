export interface StoredTokenSchema {
    user_id: string,
    expires_at: number,

    access_token: string,
    refresh_token: string,
    loa: number
    token_type: string,
    expires_in: number,
    scope: string,
    principal: string
}

export interface TokenStore {
    get(user_id: string): Promise<StoredTokenSchema | null>;
    upsert(doc: StoredTokenSchema): Promise<void>;
}




export interface Token {
    access_token: string,
    refresh_token: string,
    loa: number,
    token_type: string,
    expires_in: number,
    scope: string,
    principal: string
}

export interface TokenError {
    status: number,
    error_description: string
}
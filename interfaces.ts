export interface TokenDoc {
    user_id: string;
    access_token: string;
    refresh_token: string;
    expires_at: number;
}

export interface TokenStore {
    get(user_id: string): Promise<TokenDoc | null>;
    upsert(doc: TokenDoc): Promise<void>;
}
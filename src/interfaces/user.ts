export interface User {
    api_key: string;
    created_at: number;
}

export interface UserStore {
    get(id: string): Promise<User | null>;
    upsert(id: string, record: User): Promise<void>;
    exists(id: string): Promise<boolean>;
    delete(id: string): Promise<void>;
}
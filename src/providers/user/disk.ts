import {User, UserStore} from "../../interfaces/user.ts";

export class DiskUserStore implements UserStore {

    async upsert(id: string, record: User) {
        await Deno.writeTextFile(`./test_db/user/${id}.json`, JSON.stringify(record));
    }

    async get(id: string): Promise<User | null> {
        if (!await this.exists(id)) return null;
        try {
            const raw = await Deno.readTextFile(`./test_db/user/${id}.json`);
            const json = JSON.parse(raw);
            return json ?? null;
        } catch (_err) {
            throw new Error("There was an error reading the file");
        }
    }

    async exists(id: string): Promise<boolean> {
        return await Deno.lstat(`./test_db/user/${id}.json`).then(() => true).catch(() => false);
    }

    async delete(id: string): Promise<void> {
        await Deno.remove(`./test_db/user/${id}.json`);
    }
}
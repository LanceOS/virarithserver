import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';

class DrizzleClient {
    instance: DrizzleClient | null = null;

    constructor() {
        if(this.instance) return this.instance;
        this.instance = this;
    }

    static db = drizzle(process.env.DATABASE_URL!)
}

export default DrizzleClient;
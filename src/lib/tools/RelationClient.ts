import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';


// TODO: Use drizzle client for creating custom query functions to retrieve relations
class RelationClient {
    instance: RelationClient | null = null;

    constructor() {
        if(this.instance) return this.instance;
        this.instance = this;
    }

    // static async getUserProfile() {
    //     return await queryUserWithProfile();
    // }
}

export default RelationClient;
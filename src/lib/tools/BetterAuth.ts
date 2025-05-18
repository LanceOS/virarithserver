import { authClient } from "$lib/auth-client.ts";


class AuthClient {
    instance: AuthClient | null = null;

    constructor() {
        if(this.instance) return this.instance;
        this.instance = this;
    };

    static async signUp(data: any) {

    }
};


export default AuthClient;
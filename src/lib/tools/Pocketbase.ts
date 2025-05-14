import type { Credentials } from "$lib/@types/Credentials.js";
import PocketBase, { type RecordAuthResponse, type RecordModel } from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

class PBClient {
    instance: PBClient | null = null;
    constructor() {
        if (this.instance) return this.instance;
        this.instance = this;
    }

    /**
     * 
     * @param credentials Must include email, and password.
     * @returns Signs in the current user and returns the Auth Record
     */
    static async signin(credentials: Credentials): Promise<RecordAuthResponse> {
        try {
            const authData = await pb.collection("users").authWithPassword(credentials.email, credentials.password)
            console.log(authData)
            return authData;
        }
        catch(error) {
            console.log(error)
            throw new Error(`Failed to sign in user: ${error}`)
        }
    }

    /**
     * 
     * @param credentials Must include email, name, password, and confirm password.
     * @returns Returns the record model of the created user.
     */
    static async register(credentials: Credentials): Promise<RecordModel> {

        const data = {
            email: credentials.email,
            emailVisibility: true,
            name: credentials.name,
            password: credentials.password,
            passwordConfirm: credentials.confirmPassword
        }

        console.log(data)

        try {
            const authData = await pb.collection('users').create(data);
            return authData;
        }
        catch(error) {
            throw new Error(`Failed to create user: ${error}`)
        }
    }


    static isAuthenticated(): boolean {
        return pb.authStore.isValid;
    }

    static logout(): void {
        return pb.authStore.clear();
    }
}

export default PBClient;
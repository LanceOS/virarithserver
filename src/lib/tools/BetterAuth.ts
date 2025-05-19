import type { ISignIn, ISignUp } from "$lib/@types/IAuth.ts";
import { authClient } from "$lib/auth-client.ts";


class AuthClient {
    instance: AuthClient | null = null;

    constructor() {
        if(this.instance) return this.instance;
        this.instance = this;
    };


    static async signIn(credentials: ISignIn) {
        try {
            const { data, error } = await authClient.signIn.email({
                email: credentials.email,
                password: credentials.password
            })
            return { data, error }
        }
        catch (error) {
            console.log(error)
            return error
        }
    }

    static async signUp(credentials: ISignUp) {
        try {
            const { data, error } = await authClient.signUp.email({
                email: credentials.email,
                password: credentials.password,
                name: credentials.name,
                image: credentials.imageURL,
                role: "test"
            })

            return { data, error }
        }
        catch(error) {
            console.log(error)
            return error
        }
    }
};


export default AuthClient;
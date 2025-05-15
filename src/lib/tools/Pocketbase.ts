// import type { Credentials } from "$lib/@types/Credentials.js";
// import PocketBase, { type AuthRecord, type RecordAuthResponse, type RecordModel } from 'pocketbase';

// REMOVED POCKETBASE IN FAVOR OF LUCIA/POSTGRES/MINIO

// class PBClient {
//     instance: PBClient | null = null;
//     static pb = new PocketBase('http://127.0.0.1:8090');

//     constructor() {
//         if (this.instance) return this.instance;
//         this.instance = this;
//     }

//     /**
//      * 
//      * @param credentials Must include email, and password.
//      * @returns Signs in the current user and returns the Auth Record
//      */
//     static async signin(credentials: Credentials): Promise<RecordAuthResponse> {
//         try {
//             const authData = await PBClient.pb.collection("users").authWithPassword(credentials.email, credentials.password)
//             return authData;
//         }
//         catch (error: any) {
//             console.log(error)
//             throw new Error(`Failed to sign in user: ${error}`)
//         }
//     }

//     /**
//      * 
//      * @param credentials Must include email, name, password, and confirm password.
//      * @returns Returns the record model of the created user.
//      */
//     static async register(credentials: Credentials): Promise<RecordModel> {

//         const data = {
//             email: credentials.email,
//             emailVisibility: true,
//             name: credentials.name,
//             password: credentials.password,
//             passwordConfirm: credentials.confirmPassword
//         }
//         try {
//             const authData = await PBClient.pb.collection('users').create(data);
//             return authData;
//         }
//         catch (error: any) {
//             const errorType = {
//                 message: error.response.data.name.message,
//                 code: error.response.data.name.messageerror.response.data.name.code
//             }
//             throw new Error(`Failed to create user: ${errorType}`)
//         }
//     }

//     static isAuthenticated(): boolean {
//         return PBClient.pb.authStore.isValid;
//     }

//     static logout(): void {
//         return PBClient.pb.authStore.clear();
//     }
// }

// export default PBClient;
import { PUBLIC_URL } from "$env/static/public";

class UserClient {
    instance: UserClient | null = null;

    constructor() {
        if(this.instance) return this.instance;
        this.instance = this;
    }



    static async deleteUser() {
        try {
            const response = await fetch(`${PUBLIC_URL}/api/user/delete`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            })

            if(response) {
                return true;
            }
        }
        catch(error) {
            console.error(error)
            throw new Error(`Failed to delete user ${error}`)
        }
    }
}

export default UserClient;
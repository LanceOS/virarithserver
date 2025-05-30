import { PUBLIC_URL } from "$env/static/public";


class CategoryClient {
    instance: CategoryClient | null = null;

    constructor() {
        if(this.instance) return this.instance;
        this.instance = this;
    }

    static async getCategories() {
        try {
            const response = await fetch(`${PUBLIC_URL}/api/categories/retrieve`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })

            const data = await response.json()
            return data;
        }
        catch(error: unknown) {
            if(!error) return;
            throw new Error("Failed to get categories", error)
        }
    }

    static async createCategory() {

    }

    static async deleteCategory() {

    }

    static async updateCategory() {

    }
}

export default CategoryClient;
import { browser } from "$app/environment";
import { QueryClient } from "@tanstack/svelte-query";



class CacheClient {
    instance: CacheClient | null = null;

    queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 1000,
                enabled: browser
            }
        }
    })

    constructor() {
        if(this.instance) return this.instance;
        this.instance = this;
    }

    static async postCache = (postId: string) => {

    }
}

export default CacheClient;
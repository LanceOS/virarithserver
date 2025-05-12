

class Pocketbase {
    instance: Pocketbase | null = null;

    constructor() {
        if(this.instance) return this.instance;
        this.instance = this;
    }


    static async createUser() {
        
    }
}

export default Pocketbase;


class ServerStats {
    instance: ServerStats | null = null;

    constructor() {
        if(this.instance) return this.instance;
        this.instance = this;
    }
    
}

export default ServerStats
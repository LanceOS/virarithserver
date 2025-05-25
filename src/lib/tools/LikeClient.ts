

class LikeClient {
    instance: LikeClient | null = null;

    constructor() {
        if(this.instance) return this.instance;
        this.instance = this;
    }
}


export default LikeClient;
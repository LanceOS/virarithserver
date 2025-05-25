

class CommentClient {
    instance: CommentClient | null = null;

    constructor() {
        if(this.instance) return this.instance;
        this.instance = this;
    }

}

export default CommentClient;
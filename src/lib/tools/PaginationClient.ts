

class PaginationClient {
    instance: PaginationClient | null = null;

    constructor() {
        if(this.instance) return this.instance;
        this.instance = this;
    }


    static increasePage(page: number) {

    }
}
import * as Minio from 'minio'


class S3Client {
    instance: S3Client | null = null;

    credentials() {
        if(this.instance) return this.instance;
        this.instance = this;
    }

    // static minioClient = new Minio.Client({
    //     endPoint: "play.min.io",
    //     port: 9000,
    //     useSSL: true,
    //     accessKey: 
    // })
}
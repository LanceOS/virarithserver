import * as Minio from 'minio'
import * as Fs from 'fs'
import { uuid } from 'drizzle-orm/pg-core';



class S3Client {
    instance: S3Client | null = null;

    // TODO: Move to .env later
    static bucketName = "virarithbucket"

    credentials() {
        if (this.instance) return this.instance;
        this.instance = this;
    }

    static minioClient = new Minio.Client({
        endPoint: "play.min.io",
        port: 9000,
        useSSL: true,
        accessKey: process.env.BUCKET_ACCESS_KEY,
        secretKey: process.env.BUCKET_SECRET_KEY
    });

    static async uploadToBucket(file: any) {
        const fileStream = Fs.createReadStream(file)
        Fs.stat(file, function (err, stats) {
            if (err) {
                return console.log(err)
            }
            this.minioClient.putObject(this.bucketName, uuid(), fileStream, stats.size, function (err: string, objInfo: object) {
                if (err) {
                    return console.log(err) // err should be null
                }
                console.log('Success', objInfo)
            })
        })
    }

    static async getFromBucket(fileId: string) {
        let size = 0;
        const dataStream = await this.minioClient.getObject(this.bucketName, fileId)
        dataStream.on('data', function (chunk) {
            size += chunk.length
        })
        dataStream.on('end', function () {
            console.log('End. Total size = ' + size)
        })
        dataStream.on('error', function (err) {
            console.log(err)
        })
    }
}

export default S3Client;
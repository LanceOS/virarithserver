import { PRIVATE_BUCKET_ACCESS_KEY, PRIVATE_BUCKET_SECRET_KEY } from '$env/static/private';
import * as Minio from 'minio'
import { v4 as uuidv4 } from 'uuid';



export const minioClient = new Minio.Client({
    endPoint: "localhost",
    port: 9000,
    useSSL: false,
    accessKey: PRIVATE_BUCKET_ACCESS_KEY,
    secretKey: PRIVATE_BUCKET_SECRET_KEY
});

export const bucketName = "virarithbucket"


/**
 * Uploads a file to the MinIO bucket.
 * @param file The file to upload.
 * @returns The unique file ID (object name) in the bucket.
 */
export async function uploadFile(file: File): Promise<string> {
    try {
        const fileId = uuidv4();
        const buffer = Buffer.from(await file.arrayBuffer());

        const metaData = {
            'Content-Type': file.type,
            'Original-Name': file.name
        };

        await minioClient.putObject(
            bucketName,
            fileId,
            buffer,
        );

        console.log(`Successfully uploaded ${file.name} as ${fileId}`);
        return fileId;
    } catch (error) {
        console.error('MinIO upload error:', error);
        throw new Error(`Failed to upload file.`);
    }
}


/**
 * Generates a presigned URL to access a file for a limited time.
 * @param fileId The unique ID of the file in the bucket.
 * @returns A URL string.
 */
export async function getFileUrl(fileId: string): Promise<string> {
    try {
        // Generate a presigned URL that expires in 1 hour.
        const url = await minioClient.presignedGetObject(bucketName, fileId, 3600);
        return url;
    } catch (error) {
        console.error('MinIO URL generation error:', error);
        throw new Error('Failed to get file URL.');
    }
}
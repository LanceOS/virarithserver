import type { CommentReplySchema } from "$lib/schemas/CommentReply.ts";
import type { CommentSchema } from "$lib/schemas/Comments.ts";
import type { PostSchema } from "$lib/schemas/Posts.ts";



class S3Client {
    instance: S3Client | null = null;

    constructor() {
        if (this.instance) return this.instance;
        this.instance = null;
    }

    /**
     * 
     * @param files 
     * @param object 
     * @param fetchFn 
     * @returns Returns the list of newly created file id's that exist in Postgres and MinIO
     */
    static async uploadImages(files: File[], object: PostSchema | CommentSchema | CommentReplySchema, fetchFn: typeof fetch): Promise<string[]> {
        try {

            const successfullIds = [];
            for await (const file of files) {
                const formData = new FormData();

                formData.append('file', file);

                if (!object?.id || !object?.type) {
                    throw new Error(`Missing object fields: ${object.id}, ${object.type}`)
                }

                const objectId = object.id;
                const objectType = object.type;

                formData.append('objectId', objectId);
                formData.append('objectType', objectType);

                const response = await fetchFn('/api/objects/upload', {
                    method: 'POST',
                    body: formData
                }).then(response => response.json())
                
                successfullIds.push(response)
            }
            console.log(successfullIds)
            return successfullIds
        }
        catch (error) {
            console.error('S3Client upload error:', error);
            throw new Error(`Upload failed: ${error.message}`);
        }
    }
}

export default S3Client;



class S3Client {
    instance: S3Client | null = null;

    constructor() {
        if(this.instance) return this.instance;
        this.instance = null;
    }

    static async uploadImages(files: File[], fetchFn: typeof fetch): Promise<string[]> {
        try {

            console.log("Files in upload images S3Client", files)
            const uploadPromises = files.map(async (file): Promise<string> => {
                const formData = new FormData();
                formData.append('file', file);
                
                const response = await fetchFn('/api/objects/upload', {
                    method: 'POST',
                    body: formData
                });
                
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Upload failed: ${errorText}`);
                }
                
                return await response.text();
            });
            
            const fileIds = await Promise.all(uploadPromises);
            return fileIds;
        }
        catch(error) {
            console.error('S3Client upload error:', error);
            throw new Error(`Upload failed: ${error.message}`);
        }
    }
}

export default S3Client;
import type { ImageWithBuffer } from "$lib/@types/IImage.ts";
import type { PostWithImage, RawPost } from "$lib/@types/IPostSerializer.ts";


class PostSerializer {
    interface: PostSerializer | null = null;

    constructor() {
        if(this.interface) return this.interface;
        this.interface = this;
    }

    static serializePost = (post: RawPost) => {
        return {
            id: post.id,
            title: post.title,
            content: post.content,
            category: post.category,
            type: post.type,
            likeCount: post.likeCount,
            commentCount: post.commentCount,
            isLiked: post.isLiked,
            isEdited: post.isEdited,
            isDeleted: post.isDeleted,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
            user: post.user
        }
    }

    /**
     * @param postData 
     * @param images 
     * @returns A completed post object that includes images
     */
    static serializedPostDataAndAlignImages = (postData: RawPost[], images: ImageWithBuffer[]) => {

        return postData.map((post): PostWithImage => {
            const serialized = this.serializePost(post);
            const imagesForCurrentPost = images.filter(img => img.objectId === serialized.id && img.objectType === serialized.type)
                .filter(img => img !== null);
    
            return {
                ...serialized,
                images: imagesForCurrentPost
            }
        })
    }
}


export default PostSerializer;



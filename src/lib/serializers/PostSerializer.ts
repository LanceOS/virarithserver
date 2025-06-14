import type { ImageWithBuffer } from "$lib/@types/IImage.ts";
import type { PostWithImage, NewPost } from "$lib/@types/IPostSerializer.ts";


class PostSerializer {
    interface: PostSerializer | null = null;

    constructor() {
        if(this.interface) return this.interface;
        this.interface = this;
    }

    static serializePost = (post: NewPost) => {
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
        } satisfies NewPost
    }

    /**
     * @param postData Single post or array of posts to serialize with images
     * @param images Array of images to align with the posts
     * @returns A completed post object or array that includes aligned images
     */
    static serializedPostDataAndAlignImages = (postData: NewPost[] | NewPost, images: ImageWithBuffer[]): PostWithImage[] | PostWithImage => {
        const objectArray = Array.isArray(postData) ? postData : [postData];
        const isInputArray = Array.isArray(postData);

        const result = objectArray.map((post): PostWithImage => {
            const imagesForCurrentPost = images.filter(img => img.objectId === post.id && img.objectType === post.type)
                .filter(img => img !== null);
    
            return {
                ...post,
                images: imagesForCurrentPost
            }
        });

        return isInputArray ? result : result[0];
    }
}


export default PostSerializer;



import { DrizzleDB } from "$lib/Drizzle.ts";
import { posts, type PostSchema } from "$lib/schemas/Posts.ts";
import Generalizer from "$lib/serializers/Generalizer.ts";
import { and, eq } from "drizzle-orm";

class PostService {
    interface: PostService | null = null;

    constructor() {
        if (this.interface) return this.interface;
        this.interface = this;
    }

    /**
     * 
     * @param post 
     * @returns Returns the created post
     */
    static async createPost(post: PostSchema) {
        try {
            const cleanPost = {
                title: await Generalizer.serializeRawText(post.title),
                content: await Generalizer.serializeRawText(post.content),
                userId: post.userId,
                category: post.category,
                type: "post"
            };

            /**
             * Creating new post with drizzle
             */
            const newPost = await DrizzleDB.insert(posts).values(cleanPost).returning();
            return newPost
        }
        catch (error) {
            throw new Error(`Failed to create post: ${error}`)
        }
    }


    static async updatePost(post: PostSchema) {
        try {

            if(!post.id) {
                throw new Error("Failed to recieve post id.")
            }

            const response = await DrizzleDB.update(posts).set({
                title: await Generalizer.serializeRawText(post.title),
                content: await Generalizer.serializeRawText(post.content),
                category: post.category,
                isEdited: true
            }).where(and(eq(posts.id, post.id), eq(posts.userId, post.userId))).returning()

            return response;
        }
        catch (error: unknown) {
            throw new Error(`Failed to update post ${error}`)
        }
    }

}

export default PostService;
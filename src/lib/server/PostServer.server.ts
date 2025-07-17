import { DrizzleDB } from "$lib/Drizzle.ts";
import { posts, type PostSchema } from "$lib/schemas/Posts.ts";
import Generalizer from "$lib/serializers/Generalizer.ts";
import { and, eq } from "drizzle-orm";

const PostService = {
    /**
     * Creates a new post in the database after serializing its title and content.
     *
     * @param post The post data to be created, conforming to `PostSchema`.
     * @returns A Promise that resolves to the created post, as returned by DrizzleDB.
     * @throws {Error} If the post creation fails.
     */
    createPost: async (post: PostSchema) => {
        try {
            const cleanPost = {
                title: await Generalizer.serializeRawText(post.title),
                content: await Generalizer.serializeRawText(post.content),
                userId: post.userId,
                category: post.category,
                type: "post" // Assuming 'type' is always 'post' for this service
            };

            /**
             * Creating new post with drizzle and returning the created record.
             */
            const newPost = await DrizzleDB.insert(posts).values(cleanPost).returning();
            return newPost;
        }
        catch (error) {
            console.error("Error creating post:", error); // Log the original error
            throw new Error(`Failed to create post.`, { cause: error }); // Re-throw with cause
        }
    },

    /**
     * Updates an existing post in the database.
     *
     * @param post The post data to be updated, including its `id` and `userId`.
     * @returns A Promise that resolves to the updated post, as returned by DrizzleDB.
     * @throws {Error} If the post ID is missing or if the post update fails.
     */
    updatePost: async (post: PostSchema) => {
        try {
            if (!post.id) {
                throw new Error("Failed to receive post ID for update.");
            }

            const response = await DrizzleDB.update(posts).set({
                title: await Generalizer.serializeRawText(post.title),
                content: await Generalizer.serializeRawText(post.content),
                category: post.category,
                isEdited: true
            })
            .where(and(eq(posts.id, post.id), eq(posts.userId, post.userId)))
            .returning();

            return response;
        }
        catch (error: unknown) {
            console.error("Error updating post:", error);
            throw new Error(`Failed to update post.`, { cause: error instanceof Error ? error : new Error(String(error)) });
        }
    }
};

export default PostService;
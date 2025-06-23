import { PUBLIC_URL } from "$env/static/public";
import { DrizzleDB } from "$lib/Drizzle.ts";
import { posts, type PostSchema } from "$lib/schemas/Posts.ts";
import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';

class PostService {
    interface: PostService | null = null;

    constructor() {
        if(this.interface) return this.interface;
        this.interface = this;
    }

    /**
     * 
     * @param post 
     * @returns Returns the created post
     */
    static async createPost(post: PostSchema) {
        try {
            const rawHtmlTitle = await marked(post.title);
            const rawHtmlContent = await marked(post.content);
    
            const cleanContent = sanitizeHtml(rawHtmlContent, {
                allowedTags: sanitizeHtml.defaults.allowedTags.concat([
                    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'img', 's', 'u', 'sub', 'sup', 'cite', 'abbr', 'p', 'a'
                ]),
                allowedAttributes: {
                    a: ['href', 'name', 'target'],
                    img: ['src', 'alt', 'title', 'width', 'height'],
                },
            });
    
            const cleanTitle = sanitizeHtml(rawHtmlTitle, {
                allowedTags: sanitizeHtml.defaults.allowedTags.concat([
                    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'a'
                ]),
                allowedAttributes: {
                    a: ['href', 'name', 'target'],
                    img: ['src', 'alt', 'title', 'width', 'height'],
                },
            });
    
            const cleanPost = {
                title: cleanTitle,
                content: cleanContent,
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
            const response = await fetch(`${PUBLIC_URL}/api/posts/edit`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(post)
            })

            const data = await response.json()
            return data;
        }
        catch(error: unknown) {
            throw new Error(`Failed to update post ${error}`)
        }
    }

}

export default PostService;
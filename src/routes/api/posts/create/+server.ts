import { authClient } from '$lib/auth-client.ts';
import { DrizzleDB } from '$lib/Drizzle.ts';
import { posts, type PostSchema } from '$lib/schemas/Posts.ts';
import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';

export const POST = async ({ request }): Promise<Response> => {
	
    try {
        /**
         * If there is no user then throw an error
         * to block post creation
         */
        // const session = await authClient.getSession();
        // if(!session.data) {
        //     throw new Error("User must be logged in to create a new post!")
        // }
        
        const body: PostSchema = await request.json();
        if(!body) {
            throw new Error("Failed to get data for post")
        }

        const rawHtmlTitle = await marked(body.title);
        const rawHtmlContent = await marked(body.content);

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

        const cleanBody = {
            title: cleanTitle,
            content: cleanContent,
            userId: body.userId,
            category: body.category
        }
        
        /**
         * Creating new post with drizzle
         */
        const newPost = await DrizzleDB.insert(posts).values(cleanBody).returning()

        return new Response(JSON.stringify(newPost), {
            status: 200,
            statusText: "OK",
            headers: {
                "Content-Type": "application/json"
            }
        })
    }
    catch(error) {
        return new Response(JSON.stringify(error), {
            status: 404,
            statusText: "Failed to create post!",
            headers: {
                "Content-Type": "application/json"
            }
        })
    }
}
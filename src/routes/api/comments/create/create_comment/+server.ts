
import { authClient } from '$lib/auth-client.ts';
import { DrizzleDB } from '$lib/Drizzle.ts';
import { comments, type CommentSchema } from '$lib/schemas/Comments.ts';
import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';


export const GET = async () => {
    return new Response((""), {
        status: 200
    })
}


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

        const body: CommentSchema = await request.json();

        if (!body) {
            throw new Error("Failed to get data for comment")
        }

        const rawHtmlContent = await marked(body.content);

        const cleanContent = sanitizeHtml(rawHtmlContent, {
            allowedTags: sanitizeHtml.defaults.allowedTags.concat([
                'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'img', 's', 'u', 'sub', 'sup', 'cite', 'abbr', 'p', 'br', 'a'
            ]),
            allowedAttributes: {
                a: ['href', 'name', 'target'],
                img: ['src', 'alt', 'title', 'width', 'height'],
            },
        });

        const cleanBody = {
            content: cleanContent,
            userId: body.userId,
            postId: body.postId
        }

        /**
         * Creating new comment with drizzle
         */
        const newComment = await DrizzleDB.insert(comments).values(cleanBody).returning()

        return new Response(JSON.stringify(newComment), {
            status: 200,
            statusText: "OK",
            headers: {
                "Content-Type": "application/json"
            }
        })
    }
    catch (error: unknown) {
        return new Response(JSON.stringify(error), {
            status: 500,
            statusText: "Failed to create post!",
            headers: {
                "Content-Type": "application/json"
            }
        })
    }
}
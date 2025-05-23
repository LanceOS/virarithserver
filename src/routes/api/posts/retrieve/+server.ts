import { DrizzleDB } from '$lib/Drizzle.ts';



export const GET = async ({ request }): Promise<Response> => {
    try {
        const url = new URL(request.url);
        const topic = url.searchParams.get('topic');
        let postData;

        if(topic) {
            postData = await DrizzleDB.query.posts.findMany({ 
                where: (posts, { eq }) => eq(posts.topic, topic),
                with: {
                    user: true
                }
            });
        }
        else {
            postData = await DrizzleDB.query.posts.findMany({
                with: {
                    user: true
                } 
            });
        }

        return new Response(JSON.stringify(postData), {
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
            statusText: "FAIL",
            headers: {
                "Content-Type": "application/json"
            }
        })
    }
}
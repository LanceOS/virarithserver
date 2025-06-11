

export const POST = async ({ request }) => {
    try {
        return new Response("Success", {
            status: 200
        })
    }
    catch(error) {
        return new Response("FAIL", {
            status: 500
        })
    }
}
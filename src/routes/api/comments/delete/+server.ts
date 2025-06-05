

export const DELETE = async ({ request }) => {
    try {

    }
    catch(error: unknown) {
        return new Response(JSON.stringify(error), {
            status: 500,
            statusText: "FAIL",
            headers: {
                "Content-Type": "application/json"
            }
        })
    }
}
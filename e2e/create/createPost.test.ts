import test, { expect } from "playwright/test"

interface Post {
    title: string;
    content: string;
    user_id: string;
    topic: string;
}

test("Test user post creation", async ({ request}) => {

    const postData: Post = {
        title: "Test",
        content: "This is a test.",
        user_id: "11Tul99Joz20QDIGc3znIVeuKmZVbdT6",
        topic: "test"
    };

    const response = await request.post("http://localhost:5173/api/posts/create", {
        headers: {
            "Content-Type": "application/json"
        },
        data: JSON.stringify(postData)
    })

    expect(response.status()).toBe(200)
})


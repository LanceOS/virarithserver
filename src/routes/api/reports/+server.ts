import { auth } from '$lib/auth.ts'
import AdministrativeService from '$lib/server/Administrative.server.ts'


export const POST = async ({ request }) => {
    try {
        const body = await request.json()

        const session = await auth.api.getSession({
            headers: request.headers
        })
        const user = session?.user

        if(!user) {
            return new Response(`User my be logged in to report another user!`, {
                status: 403,
                statusText: "UNAUTHORIZED"
            })
        }

        const report = await AdministrativeService.reportObject({ reporterUserId: user.id, objectId: body.id, objectType: body.type })

        if(!report) {
            return new Response(`Failed to generate report`, {
                status: 400,
                statusText: "FAIL",
            })
        }


        return new Response(JSON.stringify(report), {
            status: 200,
            statusText: "OK",
            headers: {
                "Content-Type": "application/json"
            }
        })
    }
    catch(error) {
        return new Response(JSON.stringify(error), {
            status: 500,
            statusText: "FAIL",
            headers: {
                "Content-Type": "application/json"
            }
        })
    }
}
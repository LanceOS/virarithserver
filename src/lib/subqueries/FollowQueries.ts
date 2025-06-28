import { sql } from "drizzle-orm"


export const isFollowing = (profileUser: string, currentUser: string | undefined) => {
    if(currentUser) {
        return sql<boolean>`EXISTS (
            SELECT 1 FROM followers
            WHERE followers.sender_id = ${currentUser}
            AND followers.reciever_id = ${profileUser}
        )`;
    }
    else {
        return sql<boolean>`false`
    }
}
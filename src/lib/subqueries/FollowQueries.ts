import { sql } from "drizzle-orm"


export const isFollowing = (profileUser: string, currentUser: string | undefined) => {
    if(currentUser) {
        return sql<boolean>`EXISTS (
            SELECT 1 FROM followers
            WHERE followers.following_user_id = ${currentUser}
            AND followers.followed_user_id = ${profileUser}
        )`;
    }
    else {
        return sql<boolean>`false`
    }
}
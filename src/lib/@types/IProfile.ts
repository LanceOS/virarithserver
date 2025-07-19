import type { UserSchema } from "$lib/server/schemas/authentication.ts";
import type { ProfileSchema } from "$lib/server/schemas/Profile.ts";


export interface IProfileWithUser extends ProfileSchema {
    user: UserSchema
}
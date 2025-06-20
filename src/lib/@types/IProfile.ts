import type { UserSchema } from "$lib/schemas/authentication.ts";
import type { ProfileSchema } from "$lib/schemas/Profile.ts";


export interface IProfileWithUser extends ProfileSchema {
    user: UserSchema
}
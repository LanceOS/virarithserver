import type { UserSchema } from "$lib/schemas/authentication.ts";

export interface NewComment {
    id: string;
    createdAt: Date;
    updatedAt: Date | null;
    userId: string;
    content: string;
    type: string;
    isEdited: boolean | null;
    isDeleted: boolean | null;
    postId: string;
    likeCount: number;
    isLiked: boolean;
    replyCount: number;
    user: UserSchema
}
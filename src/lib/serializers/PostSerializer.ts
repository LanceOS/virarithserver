import type { UserSchema } from "$lib/schemas/authentication.ts";


export interface RawPost {
    id: string;
    createdAt: Date;
    updatedAt: Date | null;
    userId: string;
    title: string;
    content: string;
    category: string;
    type: string;
    isEdited: boolean | null;
    isDeleted: boolean | null;
    likeCount: number;
    commentCount: number;
    isLiked: boolean;
    user: UserSchema
}

export const serializePost = (post: RawPost) => {
    return {
        id: post.id,
        title: post.title,
        content: post.content,
        category: post.category,
        type: post.type,
        likeCount: post.likeCount,
        commentCount: post.commentCount,
        isLiked: post.isLiked,
        isEdited: post.isEdited,
        isDeleted: post.isDeleted,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        user: post.user
    }
}



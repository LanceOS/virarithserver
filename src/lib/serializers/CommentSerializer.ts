import type { UserSchema } from "$lib/schemas/authentication.ts";


interface NewComment {
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


export const serializeComment = (comment: NewComment) => {
    return {
        id: comment.id,
        content: comment.content,
        type: comment.type,
        likeCount: comment.likeCount,
        replyCount: comment.replyCount,
        isLiked: comment.isLiked,
        isEdited: comment.isEdited,
        postId: comment.postId,
        userId: comment.userId,
        isDeleted: comment.isDeleted,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
        user: comment.user
    } satisfies NewComment;
}
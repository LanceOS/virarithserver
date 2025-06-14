import type { NewComment } from "$lib/@types/ICommentSerializer.ts";


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
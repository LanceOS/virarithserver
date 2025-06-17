import type { NewComment } from "$lib/@types/ICommentSerializer.ts";

/**
 * @function serializeComment
 * @description Serializes a `NewComment` object into a standardized format.
 * This function ensures that the output conforms to the `NewComment` type,
 * providing a consistent structure for comment data.
 *
 * @param comment - The `NewComment` object to be serialized.
 * @returns A new object with the properties of the `NewComment` in a consistent order and format.
 */
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
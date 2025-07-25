import type { SerializedComment } from "$lib/@types/ICommentSerializer.ts";
import type { ImageWithUrl } from "$lib/@types/IImage.ts";
import type { NewPost, PostWithImage } from "$lib/@types/IPostSerializer.ts";
import type { PostSchema } from "$lib/server/schemas/Posts.ts";
import { marked } from "marked";
import sanitizeHtml from 'sanitize-html';

type PostTypes = NewPost | PostSchema

type PostResponseTypes = PostSchema | PostWithImage


class Generalizer {
    instance: Generalizer | null = null;

    constructor() {
        if (this.instance) return this.instance;
        this.instance = this;
    }

    /**
 * @static
 * @method serializedPostDataAndAlignImages
 * @description Serializes post data (single post or an array of posts) and aligns
 * them with their corresponding images. It filters images based on `objectId` and `objectType`
 * to ensure each post receives only its relevant images.
 *
 * @param postData - A single `NewPost` object or an array of `NewPost` objects to be serialized and enhanced with images.
 * @param images - An array of `ImageWithBuffer` objects, from which relevant images will be matched to posts.
 * @returns A `PostWithImage` object or an array of `PostWithImage` objects,
 * with each post containing an `images` array populated with its associated images.
 */
    static serializedPostDataAndAlignImages = (postData: PostTypes | PostTypes[], images: ImageWithUrl[]): PostResponseTypes[] | PostResponseTypes => {
        const objectArray = Array.isArray(postData) ? postData : [postData];
        const isInputArray = Array.isArray(postData);

        const result = objectArray.map((post) => {
            const imagesForCurrentPost = images.filter(img => img.objectId === post.id && img.objectType === post.type)
                .filter(img => img !== null);

            return {
                ...post,
                images: imagesForCurrentPost
            }
        });

        return isInputArray ? result : result[0];
    }


    /**
 * @function serializeComment
 * @description Serializes a `SerializedComment` object into a standardized format.
 * This function ensures that the output conforms to the `SerializedComment` type,
 * providing a consistent structure for comment data.
 *
 * @param comment - The `SerializedComment` object to be serialized.
 * @returns A new object with the properties of the `SerializedComment` in a consistent order and format.
 */
    static serializeComment = (comment: SerializedComment) => {
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
        }
    }


    /**
 * @static
 * @method serializePost
 * @description Serializes a single `NewPost` object into a standardized format.
 * This method ensures that the output conforms to the `NewPost` type,
 * providing a consistent structure for post data.
 *
 * @param post - The `NewPost` object to be serialized.
 * @returns A new object with the properties of the `NewPost` in a consistent order and format.
 */
    static serializePost = (post: NewPost) => {
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
        } satisfies NewPost
    }




    static async serializeRawText(text: string) {
        const rawText = await marked(text);

        const cleanedText = sanitizeHtml(rawText, {
            allowedTags: sanitizeHtml.defaults.allowedTags.concat([
                'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'img', 's', 'u', 'sub', 'sup', 'cite', 'abbr', 'p', 'a'
            ]),
            allowedAttributes: {
                a: ['href', 'name', 'target'],
                img: ['src', 'alt', 'title', 'width', 'height'],
            },
        });

        return cleanedText
    }
}


export default Generalizer;
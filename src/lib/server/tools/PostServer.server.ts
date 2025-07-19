import { DrizzleDB } from '$lib/Drizzle.ts';
import { postPageLimit } from '$lib/retrieval.config.ts';
import { posts, type PostSchema } from '$lib/server/schemas/Posts.ts';
import Generalizer from '$lib/serializers/Generalizer.ts';
import {
	isPostLikedSubquery,
	isPostReportedSubquery,
	orderBySort
} from '$lib/server/subqueries/PostsQueries.query.ts';
import { and, eq, sql } from 'drizzle-orm';

const PostServer = {
	/**
	 * Creates a new post in the database after serializing its title and content.
	 *
	 * @param post The post data to be created, conforming to `PostSchema`.
	 * @returns A Promise that resolves to the created post, as returned by DrizzleDB.
	 * @throws {Error} If the post creation fails.
	 */
	createPost: async (post: PostSchema) => {
		try {
			const cleanPost = {
				title: await Generalizer.serializeRawText(post.title),
				content: await Generalizer.serializeRawText(post.content),
				userId: post.userId,
				category: post.category,
				type: 'post' // Assuming 'type' is always 'post' for this service
			};

			/**
			 * Creating new post with drizzle and returning the created record.
			 */
			const newPost = await DrizzleDB.insert(posts).values(cleanPost).returning();
			return newPost;
		} catch (error) {
			console.error('Error creating post:', error); // Log the original error
			throw new Error(`Failed to create post.`, { cause: error }); // Re-throw with cause
		}
	},

	/**
	 * Updates an existing post in the database.
	 *
	 * @param post The post data to be updated, including its `id` and `userId`.
	 * @returns A Promise that resolves to the updated post, as returned by DrizzleDB.
	 * @throws {Error} If the post ID is missing or if the post update fails.
	 */
	updatePost: async (post: PostSchema) => {
		try {
			if (!post.id) {
				throw new Error('Failed to receive post ID for update.');
			}

			const response = await DrizzleDB.update(posts)
				.set({
					title: await Generalizer.serializeRawText(post.title),
					content: await Generalizer.serializeRawText(post.content),
					category: post.category,
					isEdited: true
				})
				.where(and(eq(posts.id, post.id), eq(posts.userId, post.userId)))
				.returning();

			return response;
		} catch (error: unknown) {
			console.error('Error updating post:', error);
			throw new Error(`Failed to update post.`, {
				cause: error instanceof Error ? error : new Error(String(error))
			});
		}
	},

	getAllPosts: async (data: {
		page: number;
		orderBy: string | null;
		userId: string | null;
		pageOffset: number;
	}) => {
		return await DrizzleDB.query.posts.findMany({
			where: (posts, { eq }) => eq(posts.isDeleted, false),
			extras: {
				likeCount: sql<number>`(
                    SELECT COUNT(*)::int 
                    FROM likes 
                    WHERE likes.object_id = posts.id
                )`.as('like_count'),
				commentCount: sql<number>`(
                    SELECT COUNT(*)::int 
                    FROM comments
                    WHERE comments.post_id = posts.id
                    AND comments.is_deleted = false
                )`.as('comment_count'),
				isLiked: isPostLikedSubquery(data.userId).as('is_liked'),
				isReported: isPostReportedSubquery(data.userId).as('is_reported')
			},
			with: {
				user: true
			},
			limit: postPageLimit,
			offset: data.pageOffset,
			orderBy: orderBySort(data.orderBy)
		});
	}
};

export default PostServer;

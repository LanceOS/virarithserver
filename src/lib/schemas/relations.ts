// POST RELATIONS

import { relations } from "drizzle-orm";
import { posts } from "./Posts.ts";
import { user } from "./authentication.ts";
import { comments } from "./Comments.ts";
import { commentReply } from "./CommentReply.ts";
import { likes } from "./Likes.ts";
import { profile } from "./Profile.ts";


export const postsRelations = relations(posts, ({ one, many }) => ({ // Added 'many'
    user: one(user, {
        fields: [posts.userId],
        references: [user.id],
    }),
    // A post can have many comments
    comments: many(comments),
    // A post can have many likes
    likes: many(likes),
}));


export const usersRelations = relations(user, ({ many, one }) => ({ // Added 'one'
    posts: many(posts),
    // A user can have many comments
    comments: many(comments),
    // A user can have many comment replies
    commentReplies: many(commentReply),
    // A user can give many likes
    likes: many(likes),
    // A user has one profile
    profile: one(profile, {
        fields: [user.id],
        references: [profile.userId],
    }),
}));


export const commentRelations = relations(comments, ({ one, many }) => ({ // Added 'many'
    user: one(user, {
        fields: [comments.userId],
        references: [user.id],
    }),
    post: one(posts, {
        fields: [comments.postId],
        references: [posts.id],
    }),
    // A comment can have many replies
    replies: many(commentReply),
    // A comment can have many likes
    likes: many(likes),
}));


export const commentReplyRelations = relations(commentReply, ({ one, many }) => ({ // Added 'many'
    // A comment reply belongs to one user
    user: one(user, {
        fields: [commentReply.userId],
        references: [user.id],
    }),
    // A comment reply belongs to one parent comment
    parentComment: one(comments, {
        fields: [commentReply.parentComment],
        references: [comments.id],
    }),
    // A comment reply can have many likes
    likes: many(likes),
}));


export const likesRelations = relations(likes, ({ one }) => ({
    user: one(user, {
        fields: [likes.userId],
        references: [user.id],
    }),
    post: one(posts, {
        fields: [likes.postId],
        references: [posts.id],
    }),
    comment: one(comments, {
        fields: [likes.commentId],
        references: [comments.id],
    }),
    commentReply: one(commentReply, {
        fields: [likes.commentReplyId],
        references: [commentReply.id],
    }),
}));


export const profileRelations = relations(profile, ({ one }) => ({
    user: one(user, {
        fields: [profile.userId],
        references: [user.id],
    }),
}));
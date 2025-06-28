// POST RELATIONS

import { relations } from "drizzle-orm";
import { posts } from "./Posts.ts";
import { user } from "./authentication.ts";
import { comments } from "./Comments.ts";
import { commentReply } from "./CommentReply.ts";
import { likes } from "./Likes.ts";
import { profile } from "./Profile.ts";
import { images } from "./Images.ts";
import { notifications } from "./Notifications.ts";
import { followers } from "./Followers.ts";

export const postsRelations = relations(posts, ({ one, many }) => ({
    user: one(user, {
        fields: [posts.userId],
        references: [user.id],
    }),
    // A post can have many comments
    comments: many(comments),
}));

export const usersRelations = relations(user, ({ many, one }) => ({
    posts: many(posts),
    // A user can have many comments
    comments: many(comments),
    // A user can have many comment replies
    commentReplies: many(commentReply),
    // A user can give many likes
    likes: many(likes),
    // A user can have many images
    images: many(images),
    // A user has one profile
    profile: one(profile, {
        fields: [user.id],
        references: [profile.userId],
    }),
    // A user can send many notifications
    sentNotifications: many(notifications, {
        relationName: "sent_notifications"
    }),
    // A user can receive many notifications
    receivedNotifications: many(notifications, {
        relationName: "received_notifications"
    }),

    // A user can follow many entities
    following: many(followers, {
        relationName: "user_following"
    }),

    followers: many(followers, {
        relationName: "user_followers"
    }),
}));

export const commentRelations = relations(comments, ({ one, many }) => ({
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
}));

export const commentReplyRelations = relations(commentReply, ({ one, many }) => ({
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
}));

// likes relation now only has user relation
export const likesRelations = relations(likes, ({ one }) => ({
    user: one(user, {
        fields: [likes.userId],
        references: [user.id],
    }),
}));

export const profileRelations = relations(profile, ({ one }) => ({
    user: one(user, {
        fields: [profile.userId],
        references: [user.id],
    }),
}));


export const imagesRelations = relations(images, ({ one }) => ({
    user: one(user, {
        fields: [images.userId],
        references: [user.id],
    }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
    // 'sender' relation: A notification has one sender (a user)
    sender: one(user, {
        fields: [notifications.senderId],
        references: [user.id],       
        relationName: "sent_notifications" 
    }),
    // 'receiver' relation: A notification has one receiver (another user)
    receiver: one(user, {
        fields: [notifications.recieverId],
        references: [user.id],               
        relationName: "received_notifications" 
    }),
}));

export const followersRelations = relations(followers, ({ one }) => ({
    // The user who is doing the following
    followerUser: one(user, {
        fields: [followers.senderId],
        references: [user.id],
        relationName: "user_following"
    }),
    // The user or entity being followed
    followedUser: one(user, { 
        fields: [followers.recieverId],
        references: [user.id],
        relationName: "user_followers" 
    }),
}));
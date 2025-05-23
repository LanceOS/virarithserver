

// POST RELATIONS

import { relations } from "drizzle-orm";
import { posts } from "./Posts.ts";
import { user } from "./authentication.ts";

export const postsRelations = relations(posts, ({ one }) => ({
    user: one(user, {
        fields: [posts.user_id],
        references: [user.id],
    }),
}));

export const usersRelations = relations(user, ({ many }) => ({
    posts: many(posts),
  }));
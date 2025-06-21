import type { UserSchema } from "$lib/schemas/authentication.ts";
import type { ImageWithUrl } from "./IImage.ts";

export interface NewPost {
    id: string;
    createdAt: Date;
    updatedAt: Date | null;
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

export interface IPagination {
    currentPage: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
}

export interface PostWithImage extends NewPost {
    images: ImageWithUrl[]
}

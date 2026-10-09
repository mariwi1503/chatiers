import { z } from "zod";
import { categories } from "@/types";
export const userSchema = z.object({
  id: z.string(),
  fullname: z.string().trim().min(2, "Nama minimal 2 karakter").max(60),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[\d\s()-]{8,20}$/, "Nomor HP tidak valid"),
  email: z.email("Email tidak valid"),
  position: z.string().trim().min(2, "Isi jabatan kamu").max(60),
  company: z.string().trim().min(2, "Isi nama perusahaan").max(80),
  address: z.string().trim().min(5, "Alamat minimal 5 karakter").max(200),
  bio: z.string().max(240),
  avatar: z.string(),
  website: z.union([z.literal(""), z.url()]),
});
const commentSchema = z.object({
  id: z.string(),
  authorId: z.string(),
  text: z.string(),
  createdAt: z.string(),
});
const postSchema = z.object({
  id: z.string(),
  authorId: z.string(),
  category: z.enum(categories),
  text: z.string(),
  createdAt: z.string(),
  timeLabel: z.string().optional(),
  images: z.array(z.string()),
  likes: z.number().nonnegative(),
  commentCount: z.number().nonnegative(),
  reposts: z.number().nonnegative(),
  liked: z.boolean(),
  saved: z.boolean(),
  reposted: z.boolean(),
  comments: z.array(commentSchema),
});
export const databaseSchema = z.object({
  version: z.literal(1),
  profile: userSchema,
  posts: z.array(postSchema),
  following: z.array(z.string()),
  activities: z.array(
    z.object({
      id: z.string(),
      authorId: z.string(),
      text: z.string(),
      time: z.string(),
      read: z.boolean(),
      postId: z.string().optional(),
    }),
  ),
  conversations: z.array(
    z.object({
      id: z.string(),
      userId: z.string(),
      unread: z.boolean(),
      messages: z.array(
        z.object({
          id: z.string(),
          text: z.string(),
          mine: z.boolean(),
          time: z.string(),
        }),
      ),
    }),
  ),
});
export const postInputSchema = z.object({
  text: z
    .string()
    .trim()
    .min(10, "Ceritakan idemu dalam minimal 10 karakter.")
    .max(1200, "Maksimal 1.200 karakter."),
  category: z.enum(categories),
  images: z.array(z.string()).max(3),
});

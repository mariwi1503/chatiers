export const categories = [
  "Bisnis",
  "Produk",
  "Ide",
  "Peluang",
  "Design",
  "Launching",
  "Cari Tim",
] as const;
export type Category = (typeof categories)[number];
export interface User {
  id: string;
  fullname: string;
  phone: string;
  email: string;
  position: string;
  company: string;
  address: string;
  bio: string;
  avatar: string;
  website: string;
}
export interface Comment {
  id: string;
  authorId: string;
  text: string;
  createdAt: string;
}
export interface Post {
  id: string;
  authorId: string;
  category: Category;
  text: string;
  createdAt: string;
  timeLabel?: string;
  images: string[];
  likes: number;
  commentCount: number;
  reposts: number;
  liked: boolean;
  saved: boolean;
  reposted: boolean;
  comments: Comment[];
}
export interface Activity {
  id: string;
  authorId: string;
  text: string;
  time: string;
  read: boolean;
  postId?: string;
}
export interface Message {
  id: string;
  text: string;
  mine: boolean;
  time: string;
}
export interface Conversation {
  id: string;
  userId: string;
  unread: boolean;
  messages: Message[];
}
export interface Database {
  version: 1;
  profile: User;
  posts: Post[];
  following: string[];
  activities: Activity[];
  conversations: Conversation[];
}

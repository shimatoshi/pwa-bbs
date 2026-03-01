export interface User {
  id: number;
  username: string;
  email: string;
  is_active: boolean;
  is_admin: boolean;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  is_readonly: boolean;
}

export interface Thread {
  id: number;
  title: string;
  created_at: string;
  author_id: number;
  category_id: number;
  author?: User;
  category?: Category;
}

export interface Post {
  id: number;
  content: string;
  created_at: string;
  author_id: number;
  thread_id: number;
  parent_id?: number;
  author?: User;
}

export interface Notification {
  id: number;
  user_id: number;
  message: string;
  link?: string;
  is_read: boolean;
  created_at: string;
}

import api from '../api';
import { Category, Thread, Post, Notification } from '../types';

export const threadService = {
  getThreads: (categoryId?: number) => 
    api.get<Thread[]>('/threads/', { params: { category_id: categoryId } }),
  
  getThread: (id: number) => 
    api.get<Thread>(`/threads/${id}`),
  
  createThread: (data: { title: string; category_id: number }) => 
    api.post<Thread>('/threads/', data),
};

export const categoryService = {
  getCategories: () => 
    api.get<Category[]>('/categories/'),
};

export const postService = {
  getPosts: (threadId: number) => 
    api.get<Post[]>(`/threads/${threadId}/posts/`),
  
  createPost: (data: { content: string; thread_id: number; parent_id?: number }) => 
    api.post<Post>('/posts/', data),
};

export const notificationService = {
  getNotifications: () => 
    api.get<Notification[]>('/notifications/'),
  
  markAsRead: (id: number) => 
    api.put<Notification>(`/notifications/${id}`, { is_read: true }),
};

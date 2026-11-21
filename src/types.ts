export type User = {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  interests: string[];
};

export type Note = {
  _id: string;
  title: string;
  content: string;
  userId: string | { _id: string; name?: string; email?: string };
  createdAt: string;
  updatedAt: string;
};

export type Post = {
  _id: string;
  title: string;
  content: string;
  userId: string | { _id: string; name?: string; email?: string };
  createdAt: string;
  updatedAt: string;
};

export type InterestGroup = {
  _id: string;
  users: Array<{ id: string; name: string }>;
};

export type UserPostsLookup = {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    interests?: string[];
  };
  posts: Array<{
    _id: string;
    title: string;
    content: string;
    userId: string;
    createdAt?: string;
    updatedAt?: string;
  }>;
};

export type ApiSuccess<T> = {
  success: true;
  message: string;
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

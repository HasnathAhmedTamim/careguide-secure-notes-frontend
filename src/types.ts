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

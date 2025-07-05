// types/comment.ts
export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    name: string;
  };
}

export type PostDBType = {
    id: string;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt: Date;
};

export type PostViewModel = Omit<PostDBType, 'createdAt'>;
export type PostInputModel = Pick<PostDBType, 'title' | 'shortDescription' | 'content' | 'blogId'>;
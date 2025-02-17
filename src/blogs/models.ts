export type BlogDBType = {
    id: string;
    name: string;
    description: string;
    websiteUrl: string;
    createdAt: Date;
};

export type BlogViewModel = Omit<BlogDBType, 'createdAt'>;

export type BlogInputModel = Pick<BlogDBType, 'name' | 'description' | 'websiteUrl'>;
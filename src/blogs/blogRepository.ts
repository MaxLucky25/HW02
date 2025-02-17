import {db} from '../db'
import {BlogDBType, BlogInputModel, BlogViewModel} from './models';

export const blogRepository = {
    async getAll(): Promise<BlogViewModel[]> {
        return db.blogs.map(this.mapToOutput);
    },

    async create(imput: BlogInputModel): Promise<BlogViewModel> {
        const newBlog: BlogDBType ={
            ...imput,
            id: Date.now().toString(),
            createdAt: new Date(),
        };
        db.blogs.push(newBlog);
        return this.mapToOutput(newBlog);
    },

    async getById(id: string): Promise<BlogViewModel | null > {
        const blog = db.blogs.find(b => b.id === id);
        return blog ? this.mapToOutput(blog) : null;
    },

    async update(id: string, input: BlogInputModel): Promise<boolean> {
        const blog = db.blogs.find(b => b.id === id);
        if (!blog) return false;

        blog.name = input.name;
        blog.description = input.description;
        blog.websiteUrl = input.websiteUrl;
        return true;
    },

    async delete(id: string): Promise<boolean> {
        const index = db.blogs.findIndex(b => b.id === id);
        if (index > -1) return false;

        db.blogs.splice(index, 1);
        return true;
    },

    mapToOutput(blog: BlogDBType): BlogViewModel {
        return {
            id: blog.id,
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl
        };
    }
};
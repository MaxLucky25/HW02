import { blogRepository } from "../blogs/blogRepository";
import { db } from "../db";
import {PostDBType, PostInputModel, PostViewModel } from "./models";



export const postRepository = {
    async create(input: PostInputModel): Promise<PostViewModel | null> {
       const blog = await blogRepository.getById(input.blogId);
       if (!blog) return null;

       const newPost: PostDBType = {
           ...input,
           id: Date.now().toString(),
           blogName: blog.name,
           createdAt: new Date()
       };

       db.posts.push(newPost);
       return this.mapToOutput(newPost);
    },

    async getById(id: string): Promise<PostViewModel | null> {
        const post = db.posts.find(p => p.id === id);
        return post ? this.mapToOutput(post) : null;
    },

    async getAll(): Promise<PostViewModel[]> {
        return db.posts.map(this.mapToOutput);
    },

    async update(id: string, input: PostInputModel): Promise<boolean> {
        const post = db.posts.find(p => p.id === id);
        if (!post) return false;

        const blog = await blogRepository.getById(input.blogId);
        if (!blog) return false;

        post.title = input.title;
        post.shortDescription = input.shortDescription;
        post.content = input.content;
        post.blogId = input.blogId;
        post.blogName = blog.name;
        return true;
    },

    async delete(id: string): Promise<boolean> {
        const index = db.posts.findIndex(p => p.id === id);
        if ( index=== -1) return false;

        db.posts.splice(index, 1);
        return true;
    },

    mapToOutput(post: PostDBType): PostViewModel {
        return {
            id: post.id,
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName
        };
    }
};
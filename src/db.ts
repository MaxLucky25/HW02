import { BlogsDBType } from "./blogs/models";
import { PostDBType } from "./posts/models";


export const db = {
    blogs: [] as BlogsDBType[],
    posts: [] as PostDBType[]
};
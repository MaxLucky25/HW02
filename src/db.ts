import { BlogDBType } from "./blogs/models";
import { PostDBType } from "./posts/models";


export const db = {
    blogs: [] as BlogDBType[],
    posts: [] as PostDBType[]
};
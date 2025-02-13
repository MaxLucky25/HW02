import express, { Request, Response } from 'express';
import { body, param, validationResult } from 'express-validator';
import basicAuth from 'express-basic-auth';

const app = express();
app.use(express.json());

// In-memory storage
let blogs = [
    {
        id: '1',
        name: 'Tech Blog',
        description: 'Technology News',
        websiteUrl: 'https://tech.com'
    },
];

let posts = [
    {
        id: '1',
        title: 'Post 1',
        shortDescription: 'Short Description',
        content: 'Content',
        blogId: '1',
        blogName: 'Tech Blog'
    },
];

// ---------- Blog CRUD Routes ----------

// GET /blogs - открытый эндпоинт
app.get('/blogs', (req: Request, res: Response): void => {
    res.status(200).json(blogs);
});

// POST /blogs - защищён basicAuth
app.post('/blogs',
    basicAuth({
        users: { 'admin': 'qwerty' },
        challenge: true,
        realm: 'Private Area',
    }),
    body('name')
        .exists({ checkFalsy: true }).withMessage('name is required')
        .bail()
        .isString()
        .trim()
        .isLength({ max: 15 }).withMessage('name is too long'),
    body('description')
        .exists({ checkFalsy: true }).withMessage('description is required')
        .bail()
        .isString()
        .trim()
        .isLength({ max: 500 }).withMessage('description is too long'),
    body('websiteUrl')
        .exists({ checkFalsy: true }).withMessage('websiteUrl is required')
        .bail()
        .isString()
        .trim()
        .matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/)
        .withMessage('website url does not match the template'),
    (req: Request, res: Response): void => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const formattedErrors = errors.array({ onlyFirstError: true }).map(e => ({
                message: e.msg,
                field: (e as unknown as { param: string }).param,
            }));
            // Если требуется определённый порядок – сортируем (например, alphabetically)
            formattedErrors.sort((a, b) => a.field.localeCompare(b.field));
            res.status(400).json({ errorsMessages: formattedErrors });
            return;
        }
        const newBlog = {
            id: String(blogs.length + 1),
            name: req.body.name,
            description: req.body.description,
            websiteUrl: req.body.websiteUrl,
        };
        blogs.push(newBlog);
        res.status(201).json(newBlog);
    }
);

// GET /blogs/:id - открытый эндпоинт
app.get('/blogs/:id',
    param('id')
        .exists({ checkFalsy: true }).withMessage('id is required')
        .bail()
        .isString().withMessage('Invalid blog id'),
    (req: Request, res: Response): void => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const formattedErrors = errors.array({ onlyFirstError: true }).map(e => ({
                message: e.msg,
                field: (e as unknown as { param: string }).param,
            }));
            res.status(400).json({ errorsMessages: formattedErrors });
            return;
        }
        const blog = blogs.find(b => b.id === req.params.id);
        if (!blog) {
            res.status(404).json({ errorsMessages: [{ message: 'Blog not found', field: 'id' }] });
            return;
        }
        res.status(200).json(blog);
    }
);

// PUT /blogs/:id - защищён
app.put('/blogs/:id',
    basicAuth({
        users: { 'admin': 'qwerty' },
        challenge: true,
        realm: 'Private Area',
    }),
    param('id')
        .exists({ checkFalsy: true }).withMessage('id is required')
        .bail()
        .isString().withMessage('Invalid blog id'),
    body('name')
        .exists({ checkFalsy: true }).withMessage('name is required')
        .bail()
        .isString()
        .trim()
        .isLength({ max: 15 }).withMessage('name is too long'),
    body('description')
        .exists({ checkFalsy: true }).withMessage('description is required')
        .bail()
        .isString()
        .trim()
        .isLength({ max: 500 }).withMessage('description is too long'),
    body('websiteUrl')
        .exists({ checkFalsy: true }).withMessage('websiteUrl is required')
        .bail()
        .isString()
        .trim()
        .matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/)
        .withMessage('website url does not match the template'),
    (req: Request, res: Response): void => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const formattedErrors = errors.array({ onlyFirstError: true }).map(e => ({
                message: e.msg,
                field: (e as unknown as { param: string }).param,
            }));
            formattedErrors.sort((a, b) => a.field.localeCompare(b.field));
            res.status(400).json({ errorsMessages: formattedErrors });
            return;
        }
        const blog = blogs.find(b => b.id === req.params.id);
        if (!blog) {
            res.status(404).json({ errorsMessages: [{ message: 'Blog not found', field: 'id' }] });
            return;
        }
        blog.name = req.body.name;
        blog.description = req.body.description;
        blog.websiteUrl = req.body.websiteUrl;
        res.status(204).send();
    }
);

// DELETE /blogs/:id - защищён
app.delete('/blogs/:id',
    basicAuth({
        users: { 'admin': 'qwerty' },
        challenge: true,
        realm: 'Private Area',
    }),
    (req: Request, res: Response): void => {
        const blogIndex = blogs.findIndex(b => b.id === req.params.id);
        if (blogIndex === -1) {
            res.status(404).json({ errorsMessages: [{ message: 'Blog not found', field: 'id' }] });
            return;
        }
        blogs.splice(blogIndex, 1);
        res.status(204).send();
    }
);

// ---------- Post CRUD Routes ----------

// GET /posts - открытый эндпоинт
app.get('/posts', (req: Request, res: Response): void => {
    res.status(200).json(posts);
});

// POST /posts - защищён
app.post('/posts',
    basicAuth({
        users: { 'admin': 'qwerty' },
        challenge: true,
        realm: 'Private Area',
    }),
    body('title')
        .exists({ checkFalsy: true }).withMessage('title is required')
        .bail()
        .isString()
        .trim()
        .isLength({ max: 30 }).withMessage('title is too long'),
    body('shortDescription')
        .exists({ checkFalsy: true }).withMessage('shortDescription is required')
        .bail()
        .isString()
        .trim()
        .isLength({ max: 100 }).withMessage('shortDescription is too long'),
    body('content')
        .exists({ checkFalsy: true }).withMessage('content is required')
        .bail()
        .isString()
        .trim()
        .isLength({ max: 1000 }).withMessage('content is too long'),
    body('blogId')
        .exists({ checkFalsy: true }).withMessage('blogId is required')
        .bail()
        .isString().withMessage('Invalid blogId')
        .custom(async (value: string) => {
            const blogExists = blogs.find(blog => blog.id === value);
            if (!blogExists) {
                throw new Error('Blog ID does not exist');
            }
            return true;
        }),
    (req: Request, res: Response): void => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const formattedErrors = errors.array({ onlyFirstError: true }).map(e => ({
                message: e.msg,
                field: (e as unknown as { param: string }).param,
            }));
            formattedErrors.sort((a, b) => a.field.localeCompare(b.field));
            res.status(400).json({ errorsMessages: formattedErrors });
            return;
        }
        const blog = blogs.find(b => b.id === req.body.blogId);
        if (!blog) {
            res.status(400).json({ errorsMessages: [{ message: 'Blog does not exist', field: 'blogId' }] });
            return;
        }
        const newPost = {
            id: String(posts.length + 1),
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
            blogId: req.body.blogId,
            blogName: blog.name,
        };
        posts.push(newPost);
        res.status(201).json(newPost);
    }
);

// GET /posts/:id - открытый эндпоинт
app.get('/posts/:id', (req: Request, res: Response): void => {
    const post = posts.find(p => p.id === req.params.id);
    if (!post) {
        res.status(404).send('Post not found');
        return;
    }
    res.status(200).json(post);
});

// PUT /posts/:id - защищён
app.put('/posts/:id',
    basicAuth({
        users: { 'admin': 'qwerty' },
        challenge: true,
        realm: 'Private Area',
    }),
    body('title')
        .exists({ checkFalsy: true }).withMessage('title is required')
        .bail()
        .isString()
        .trim()
        .isLength({ max: 30 }).withMessage('Title is too long'),
    body('shortDescription')
        .exists({ checkFalsy: true }).withMessage('shortDescription is required')
        .bail()
        .isString()
        .trim()
        .isLength({ max: 100 }).withMessage('shortDescription is too long'),
    body('content')
        .exists({ checkFalsy: true }).withMessage('content is required')
        .bail()
        .isString()
        .trim()
        .isLength({ max: 1000 }).withMessage('Content is too long'),
    body('blogId')
        .exists({ checkFalsy: true }).withMessage('blogId is required')
        .bail()
        .isString().withMessage('Blog ID is required')
        .custom(async (value: string) => {
            const blogExists = blogs.find(blog => blog.id === value);
            if (!blogExists) {
                throw new Error('Blog ID does not exist');
            }
            return true;
        }),
    (req: Request, res: Response): void => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const formattedErrors = errors.array({ onlyFirstError: true }).map(e => ({
                message: e.msg,
                field: (e as unknown as { param: string }).param,
            }));
            formattedErrors.sort((a, b) => a.field.localeCompare(b.field));
            res.status(400).json({ errorsMessages: formattedErrors });
            return;
        }
        const postIndex = posts.findIndex(p => p.id === req.params.id);
        if (postIndex === -1) {
            res.status(404).send('Post not found');
            return;
        }
        const updatedPost = {
            ...posts[postIndex],
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
            blogId: req.body.blogId,
        };
        posts[postIndex] = updatedPost;
        res.status(204).send();
    }
);

// DELETE /posts/:id - защищён
app.delete('/posts/:id',
    basicAuth({
        users: { 'admin': 'qwerty' },
        challenge: true,
        realm: 'Private Area',
    }),
    (req: Request, res: Response): void => {
        const postIndex = posts.findIndex(p => p.id === req.params.id);
        if (postIndex === -1) {
            res.status(404).send('Post not found');
            return;
        }
        posts.splice(postIndex, 1);
        res.status(204).send();
    }
);

// DELETE /testing/all-data - открытый эндпоинт
app.delete('/testing/all-data', (req: Request, res: Response): void => {
    blogs = [];
    posts = [];
    res.status(204).send();
});

export default app;

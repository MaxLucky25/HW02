import { Router } from "express";
import { postRepository } from "./postRepository";
import { authMiddleware } from "../common/authMiddleware";
import { postValidators } from "./validators";
import { inputCheckErrorsMiddleware } from "../common/validationMiddleware";


export const postsRouter = Router();

postsRouter.get('/', async (req, res) => {
    const posts = await postRepository.getAll();
    res.status(200).json(posts);
});

postsRouter.get('/:id', async (req, res) => {
    const post = await postRepository.getById(req.params.id);
    post ? res.json(post) : res.sendStatus(404)
});


postsRouter.post('/',
    authMiddleware,
    ...postValidators,
    inputCheckErrorsMiddleware,
    async (req, res) => {
        const newPost = await postRepository.create(req.body);
        newPost ? res.status(201).json(newPost) : res.sendStatus(404)
    }
    );

postsRouter.put('/:id',
    authMiddleware,
    ...postValidators,
    inputCheckErrorsMiddleware,
    async (req, res) => {
        const updated = await postRepository.update(req.params.id, req.body);
        updated ? res.status(204) : res.sendStatus(404);

    });

postsRouter.delete('/:id',
    authMiddleware,
    async (req, res) => {
        const deleted = await postRepository.delete(req.params.id);
        deleted ? res.status(204) : res.sendStatus(404)
    });

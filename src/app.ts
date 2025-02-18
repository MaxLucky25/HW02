import express from 'express';
import cors from 'cors'
import { testingRouter } from './testing/router';
import { blogsRouter } from './blogs/routers';
import { postsRouter } from './posts/routers';






const app = express();
app.use(express.json());
app.use(cors());

app.use('/blogs', blogsRouter);
app.use('/posts', postsRouter);
app.use('/testing',testingRouter);



export default app;
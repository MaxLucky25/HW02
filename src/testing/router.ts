import { Router } from "express";
import {db} from '../db';



export const testingRouter = Router();

testingRouter.delete('/all-data', (req, res) => {
    db.blogs =[];
    db.posts =[];
    res.sendStatus(204)
})
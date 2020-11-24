import express from "express";
import { Database } from '../methods/database';
import { User } from '../typedef/types';

const userRouter = express.Router();

userRouter.get('/findall', (req, res) => Database<User, string>("users", "").FindAll(req, res));

userRouter.post('/search', (req, res) => Database<User, string>("users", "firstname").Search(req, res));

export default userRouter;
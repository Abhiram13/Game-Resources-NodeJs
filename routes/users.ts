import express from "express";
import { Database } from '../helpers/helper';
import { User } from '../typedef/types';

const userRouter = express.Router();

userRouter.get('/findall', (req, res) => Database<User, string>("users", "").FindAll(req, res));

export default userRouter;
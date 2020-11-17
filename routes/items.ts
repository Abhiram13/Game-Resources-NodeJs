import express from "express";
import { Database } from '../helpers/helper';
import { Items } from '../typedef/types';
import { ObjectID } from "mongodb";

const itemRouter = express.Router();

itemRouter.get('/findone/:id', (req, res) => {
   Database<Items, { _id: ObjectID; }>("items", { "_id": new ObjectID(req.params.id) }).FindById(req, res);
});

itemRouter.post('/search', (req, res) => Database<Items, string>("items", "itemName").Search(req, res));

itemRouter.get('/findall', (req, res) => Database<Items, string>("items", "").FindAll(req, res));

export default itemRouter;
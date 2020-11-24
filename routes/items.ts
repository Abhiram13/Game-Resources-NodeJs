import express from "express";
import { Database } from '../methods/database';
import { Items, ObjId } from '../typedef/types';
import { ObjectID } from "mongodb";
import { ServerResponse } from '../methods/response';

const itemRouter = express.Router();

itemRouter.get('/findone/:id', async (req, res) => {
   const obj: ObjId = {
      _id: new ObjectID(req.params.id),
   }

   try {
      let item: Items | null = await Database<Items, ObjId>("items", obj).FindById();
      new ServerResponse<Items | null>(item, res).Send();
   } catch (e) {
      new ServerResponse<any>(e, res).Send();
   }
});

itemRouter.post('/search', async (req, res) => {
   try {
      let items: Items[] = await Database<Items, string>("items", "itemName").Search(req);
      new ServerResponse<Items[]>(items, res).Send();
   } catch (e) {
      new ServerResponse<any>(e, res).Send();
   }
});

itemRouter.get('/findall', async (req, res) => {
   try {
      let items: Items[] = await Database<Items, string>("items", "").FindAll();
      new ServerResponse<Items[]>(items, res).Send();
   } catch (e: any) {
      new ServerResponse<any>(e, res).Send();
   }
});

export default itemRouter;
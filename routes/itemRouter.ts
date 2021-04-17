import express from "express";
import { Database } from '../methods/database';
import { Items, ObjId } from '../typedef/types';
import { ObjectID } from "mongodb";
import { ServerResponse } from '../methods/response';

const itemRouter = express.Router();

interface Obj {
   itemName: string,
}

interface Query {
   _id: ObjectID,
}

itemRouter.get('/findone/:id', async (req, res) => {
   const obj: ObjId = {
      _id: new ObjectID(req.params.id),
   };

   try {
      let item: Items | null = await Database<Items, ObjId>("items", obj).FindById();
      new ServerResponse<Items | null>(item, res)
   } catch (e) {
      new ServerResponse<any>(e, res, 400)
   }
});

itemRouter.post('/search', async (req, res) => {
   try {
      let items: Items[] = await Database<Items, string>("items", "itemName").Search(req);      
      res.status(200).send(items).end()
   } catch (e) {
      new ServerResponse<any>(e, res, 400)
   }
});

itemRouter.get('/findall', async (req, res) => {
   try {
      let items: Items[] = await Database<Items, string>("items", "").FindAll();   
      res.status(200).send(items).end()
   } catch (e: any) {
      new ServerResponse<any>(e, res, 400)
   }
});

itemRouter.post('/update', async (req, res) => {
   try {
      let id: Query = {
         "_id": new ObjectID(req.body._id),
      };

      let name: Obj = {
         itemName: "Blue Milk"
      };

      let count = await Database<Items, Obj>("items", name).Update<Query>(id);
      new ServerResponse<number>(count.modifiedCount, res)
   } catch (e: any) {
      new ServerResponse<any>(e, res, 400)
   }
});

export default itemRouter;
import { Mongo, app } from '../index';
import { Application } from "express";
import e from "express";
import { Collection, Cursor, Db, MongoClient } from "mongodb";
import { Items } from '../typedef/types';

export class Item {
   static FetchAll(request: e.Request, response: e.Response): void {
      try {
         let ItemsCollection: Cursor<Items> = Mongo.client.db("Mordor").collection<Items>("items").find({});
         response.status(200).send(ItemsCollection.toArray());
      } catch (e) {
         console.log(e);
         response.status(500);
      }
   } 
}
import { Mongo, app } from '../index';
import { Application } from "express";
import e from "express";
import { Collection, Cursor, Db, MongoClient } from "mongodb";
import { Items } from '../typedef/types';

export class Item {
   static async FetchAll(): Promise<Items[] | null> {
      try {
         let ItemsCollection: Cursor<Items> = Mongo.client.db("Mordor").collection<Items>("items").find({});
         return await ItemsCollection.toArray();
      } catch (e) {
         console.log(e);
      }

      return null;
   } 
}
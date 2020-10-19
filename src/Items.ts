import { Mongo, app } from '../index';
import { Application } from "express";
import e from "express";
import { Collection, Cursor, Db, MongoClient } from "mongodb";
import { Items } from '../typedef/types';

export class Item {
   static async FetchAll(request: e.Request, response: e.Response): Promise<void> {
      try {
         let ItemsCollection: Cursor<Items> = await Mongo.client.db("Mordor").collection<Items>("items").find({});
         ItemsCollection.toArray().then(function(items) {
            response.status(200).send(items);
         });         
      } catch (e) {
         console.log(e);
         response.status(500);
      }
   } 
}
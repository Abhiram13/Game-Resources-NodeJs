import { Mongo, app } from '../index';
import { Application } from "express";
import e from "express";
import { Collection, Cursor, Db, MongoClient, ObjectID } from "mongodb";
import { Items } from '../typedef/types';

export class Item {
   // static collection: Collection<Items> = Mongo.client.db("Mordor").collection<Items>("items");
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

   static async FindById(request: e.Request, response: e.Response): Promise<void> {
      try {
         await Mongo.client.db("Mordor").collection<Items>("items").findOne({ "_id": new ObjectID(request.params.id) }, function(err, result: Items) {
            if (err) {
               response.status(500).send(err).end();
            } else {
               response.status(200).send(result);
            }
         });
      } catch (e) {
         console.log(e);
      }
   }

   static async Search(request: e.Request, response: e.Response): Promise<void> {
      try {
         if (request.body === undefined) {
            response.status(500).end();
         }

         console.log(request.body);
         await Mongo.client.db("Mordor").collection<Items>("items").findOne({ "itemName": request.body.key }, function(err, item) {
            if (err) {
               console.log(err);
               response.status(500).send(err);
            } else {
               console.log(item);
               response.status(200).send(item);
            }
         })
      } catch (e) {
         //
      }
   }
}
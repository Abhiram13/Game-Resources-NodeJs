import {Mongo, app} from '../index';
import {Application} from "express";
import e from "express";
import {Collection, Cursor, Db, MongoClient, ObjectID} from "mongodb";
import {Items} from '../typedef/types';

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

   static async FindById(request: e.Request, response: e.Response): Promise<void> {
      try {
         await Mongo.client.db("Mordor").collection<Items>("items").findOne({"_id": new ObjectID(request.params.id)}, function(err, result: Items) {
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
         await Mongo.client.db("Mordor").collection<Items>("items").find({}).toArray().then(function(items) {
            let array: Items[] = [];
            for (var i: number = 0; i < items.length; i++) {
               if (items[i].itemName.substring(0, request.body.string.length).toUpperCase() === request.body.string.toUpperCase()) {
                  array.push(items[i]);
               }
            }

            if (array.length > 0) {
               response.status(200).send(array);
            } else {
               response.status(404).end();
            }
         });
      } catch (e) {
         response.status(500).send(e).end();
      }
   }
}
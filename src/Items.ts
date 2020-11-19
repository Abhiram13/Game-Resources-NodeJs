import {Mongo, app} from '../index';
import {Application} from "express";
import e from "express";
import {Collection, Cursor, Db, MongoClient, ObjectID} from "mongodb";
import {Items} from '../typedef/types';

export class Item {
   static async Update(request: e.Request, response: e.Response): Promise<void> {
      try {
         let obj = function() {
            let x: {[key: string]: string} = {};

            for (var key in request.body) {
               x[key] = request.body[key]
            }

            return x;
         }

         await Mongo.client.db("Mordor").collection<Items>("items").updateOne({ _id: new ObjectID(request.params.id) }, { $set: obj() }, { upsert: true }, function(er, result) {
            console.log(result);
         });
      } catch (e) {
         //
      }
   }
}
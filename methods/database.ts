import { Mongo } from "..";
import { IOperations } from '../typedef/types';
import { Collection } from "mongodb";

export function Database<T, O>(collection: string, options: O): IOperations {
   let database: Collection<T> = Mongo.client.db("Mordor").collection<T>(collection);

   return {
      FindAll: async function(request, response) {
         try {
            await database.find({}).toArray().then(function(item: T[]) {
               response.status(200).send(item);
            });
         } catch (e) {
            response.status(500).send(e).end();
         }
      },

      FindById: async function(request, response) {
         try {
            await database.findOne(options).then(function(item) {
               response.send(item).status(200);
            });
         } catch (e) {
            response.status(500).send(e).end();
         }
      },

      Search: async function(request, response) {
         try {
            if (options) {
               await database.find({}).toArray().then(function(items) {
                  let array: T[] = [];
                  for (var i: number = 0; i < items.length; i++) {
                     let item: { [key: string]: any; } = items[i];
                     if (item[options as unknown as string].substring(0, request.body.string.length).toUpperCase() === request.body.string.toUpperCase()) {
                        array.push(items[i]);
                     }
                  }

                  if (array.length > 0) {
                     response.status(200).send(array);
                  } else {
                     response.status(404).end();
                  }
               });
            } else {
               response.status(200).send(await database.find({}).toArray());
            }
         } catch (e) {
            response.status(500).send(e).end();
         }
      }
   };
}
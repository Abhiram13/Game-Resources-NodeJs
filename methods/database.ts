import { Mongo } from "..";
import { IOperations } from '../typedef/types';
import { Collection } from "mongodb";

export function Database<T, O>(collection: string, options: O): IOperations<T> {
   let database: Collection<T> = Mongo.client.db("Mordor").collection<T>(collection);

   // try {
   //    if (options) {
   //       await database.find({}).toArray().then(function(items) {
   //          let array: T[] = [];
   //          for (var i: number = 0; i < items.length; i++) {
   //             let item: { [key: string]: any; } = items[i];
   //             if (item[options as unknown as string].substring(0, request.body.string.length).toUpperCase() === request.body.string.toUpperCase()) {
   //                array.push(items[i]);
   //             }
   //          }

   //          if (array.length > 0) {
   //             response.status(200).send(array);
   //          } else {
   //             response.status(404).end();
   //          }
   //       });
   //    } else {
   //       response.status(200).send(await database.find({}).toArray());
   //    }
   // } catch (e) {
   //    response.status(500).send(e).end();
   // }

   return {
      FindAll: async function () {
         return await database.find({}).toArray();
      },

      FindById: async function (request, response) {
         try {
            await database.findOne(options).then(function(item) {
               response.send(item).status(200);
            });
         } catch (e) {
            response.status(500).send(e).end();
         }
      },

      Search: async function (request) {
         if (options) {
            let array: T[] = await database.find({}).toArray();
            let items: T[] = [];
            let len: number = array.length;

            for (let i: number = len; i--;) {
               let item: { [key: string]: any; } = array[i];

               if (item[options as unknown as string].substring(0, request.body.string.length).toUpperCase() === request.body.string.toUpperCase()) {
                  items.push(array[i]);
               }
            }

            return items;
         }

         return await database.find({}).toArray();
      }
   };
}
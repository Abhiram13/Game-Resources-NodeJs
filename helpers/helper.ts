import { Mongo } from "..";
import { Token, IOperations, Items, User, IString, Property } from '../typedef/types';
import e from "express";
import { Collection, Cursor, Db, ObjectId, ObjectID } from "mongodb";

export let string: IString = function(): IString {
   return {
      Encode: function(string) {
         let bufferObj: Buffer = Buffer.from(string, "utf8");
         let base64String: string = bufferObj.toString("base64");
         return base64String;
      },
      Decode: function(string) {
         let buffer: Buffer = Buffer.from(string, "base64");
         let decode: string = buffer.toString("utf8");
         return decode;
      }
   };
}();

export class Authorisation {
   static Headers(headers: string): boolean {
      try {
         const [username, password] = headers.split(":"); /////// ERRROOOORR
         if (username === "abhi" && password === "123") return true;
      } catch (e) {
         console.log(e);
      }
      return false;
   }

   static async Token(token: string | string[] | undefined): Promise<boolean> {
      if (token === undefined || token === null) return false;

      let document = await Mongo.client.db("Mordor").collection("tokens").findOne({ "Token": token });

      return (document && Object.keys(document).length > 0) ? true : false;
   }
}

export class TOKEN {
   private static create(header: string): string {
      const [username, password] = header.split(":");
      let Token: string = string.Encode(`${username}_${password}_${new Date().getHours()}_${new Date().getMinutes()}_${new Date().getSeconds()}`);
      return Token;
   }

   private static killToken(header: string): void {
      const [username, password] = header.split(":");
      Mongo.client.db("Mordor").collection("tokens").updateOne({ username: username }, { $set: { Token: null } }, { upsert: true });
   }

   static generate(header: string): void {
      const [username, password] = header.split(":");
      let isTokenExit: Token | null = null;

      Mongo.client.db("Mordor").collection("tokens").findOne({ username: username })
         .then(function(response: Token | null) {
            isTokenExit = response;
         });

      // if Token is null, then the token will be updated with new value
      // else, new token will be created
      if (isTokenExit === null) {
         Mongo.client.db("Mordor").collection("tokens").updateOne({ username: username, password: password }, { $set: { Token: this.create(header) } }, { upsert: true });
      } else {
         Mongo.client.db("Mordor").collection("tokens").insertOne({ username: username, password: password, Token: this.create(header) });
      }

      (async () => {
         let promise = new Promise((resolve, reject) => {
            setTimeout(() => this.killToken(header), 60000);
         });

         await promise;
      })();
   }

   static async findToken(header: string): Promise<string | null | undefined> {
      const [username, password] = header.split(":");
      let tokenObject: Token | null = await Mongo.client.db("Mordor").collection("tokens").findOne({ username: username });
      return tokenObject?.Token;
   }
}

export function Database<T, O>(collection: string, options: O): IOperations {
   let database: Collection<T> = Mongo.client.db("Mordor").collection<T>(collection);

   return {
      FindAll: async function(request, response) {
         try {
            await database.find({}).toArray().then(function(item: T[]) {
               response.status(200).send(item);
            });
         } catch (e) {
            console.log(e);
            response.status(500).send(e).end();
         }
      },

      FindById: async function(request, response) {
         try {
            await database.findOne(options).then(function(item) {
               response.send(item).status(200);
            });
         } catch (e) {
            console.log(e);
            response.status(500).send(e).end();
         }
      },

      Search: async function(request, response) {
         try {
            await database.find({}).toArray().then(function(items) {
               let array: T[] = [];
               for (var i: number = 0; i < items.length; i++) {
                  let item: Property = items[i];
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
         } catch (e) {

         }
      }
   };
}
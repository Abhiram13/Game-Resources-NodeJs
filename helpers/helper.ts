import { Mongo } from "..";
import { Token, IOperations, Items, User, IString, IToken } from '../typedef/types';
import e, { response } from "express";
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
         const [username, password] = headers.split(":");
         if (username === "abhi" && password === "123") return true;
      } catch (e) { }
      return false;
   }

   static async Token(token: string | string[] | undefined): Promise<boolean> {
      if (token === undefined || token === null) return false;

      let document = await Mongo.client.db("Mordor").collection("tokens").findOne({ "Token": token });

      return (document && Object.keys(document).length > 0) ? true : false;
   }
}

export let TOKEN = function(header: string): IToken {
   const [username, password] = header.split(":");
   const collection: Collection<Token> = Mongo.client.db("Mordor").collection("tokens");

   /** @private */
   let create = function(): string {
      let token: string = string.Encode(`${username}_${password}_${new Date().getHours()}_${new Date().getMinutes()}_${new Date().getSeconds()}`);
      return token;
   };

   /** @private */
   let killToken = function(): void {
      collection.updateOne({ username: username }, { $set: { Token: null } }, { upsert: true });
   };

   return {
      FindToken: async function(): Promise<string | null | undefined> {
         let x: Token | null = await collection.findOne({ username: username });
         return x?.Token;
      },
      Generate: function() {
         let token: Token | null = null;
         collection.findOne({ username: username }).then((response: Token | null) => { token = response; });

         token
            ? collection.insertOne({ username: username, password: password, Token: create() })
            : collection.updateOne({ username: username, password: password }, { $set: { Token: create() } }, { upsert: true });

         (async () => {
            let promise = new Promise((resolve, reject) => {
               setTimeout(() => killToken(), 60000);
            });

            await promise;
         })();
      }
   };
};

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
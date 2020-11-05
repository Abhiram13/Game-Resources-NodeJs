import { Mongo } from "..";
import { Token, DataB } from '../typedef/types';
import e from "express";
import { Collection, Cursor, Db } from "mongodb";

export class String {
   static Encode(string: string): string {
      let bufferObj: Buffer = Buffer.from(string, "utf8");
      let base64String: string = bufferObj.toString("base64");
      return base64String;
   }

   static Decode(string: string): string {
      let buffer: Buffer = Buffer.from(string, "base64");
      let decode: string = buffer.toString("utf8");
      return decode;
   }
}

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
      let Token: string = String.Encode(`${username}_${password}_${new Date().getHours()}_${new Date().getMinutes()}_${new Date().getSeconds()}`);
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

export function Database<T, O>(collection: string, options: O): DataB {
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
      }
   }
} 
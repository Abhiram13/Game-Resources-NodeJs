import { Mongo } from "..";
import { Token } from '../typedef/types';

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
         const [ username, password ] = headers.split(":");
         if (username === "abhi" && password === "123") return true;
      } catch (e) {
         console.log(e);
      }
      return false;
   }
}

export class TOKEN {
   private static create(header: string): string {
      const [ username, password ] = header.split(":");
      let Token: string = String.Encode(`${ username }_${ password }_${ new Date().getHours() }_${ new Date().getMinutes() }_${ new Date().getSeconds() }`);
      return Token;
   }

   static generate(header: string): void {
      const [ username, password ] = header.split(":");  
      let isTokenExit: Token | null = null;
      
      Mongo.client.db("Mordor").collection("tokens").findOne({ username: 'abhi' })
         .then(function(response: Token | null) {
            isTokenExit = response;
         });
      
      if (isTokenExit === null) {
         Mongo.client.db("Mordor").collection("tokens").updateOne({ username: username, password: password }, { $set: { Token: this.create(header) } }, { upsert: true });
      } else {
         Mongo.client.db("Mordor").collection("tokens").insertOne({ username: username, password: password, Token: this.create(header) }); 
      }
   }

   static killToken(header: string): void {
      const [ username, password ] = header.split(":");
      Mongo.client.db("Mordor").collection("tokens").updateOne({ username: username }, { $set: { Token: null } }, { upsert: true });
   }
}
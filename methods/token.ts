import { Mongo } from "..";
import { Token, IToken } from '../typedef/types';
import { Collection, ObjectID } from "mongodb";
import { string } from './string';

export let TOKEN = function (header: string): IToken {
   const [username, password] = header.split(":");
   const collection: Collection<Token> = Mongo.client.db("Mordor").collection("tokens");
   
   const create = function(): string {
      const token: string = string.Encode(`${username}:${password}`);
      return token;
   };

   const emptyToken: Token = {
      Token: "",
      _id: new ObjectID(),
      password: "",
      username: ""
   }

   return {
      FindToken: async function(): Promise<string | null | undefined> {
         let x: Token | null = await collection.findOne({ username: username });
         return x?.Token;
      },
      
      Generate: async function(): Promise<void> {
         var token: Token = await collection.findOne({username: username}) || emptyToken;

         token.Token
            ? collection.insertOne({ username: username, password: password, Token: create() })
            : collection.updateOne({ username: username, password: password }, { $set: { Token: create() } }, { upsert: true });
      }
   };
};
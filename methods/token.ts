import { Mongo } from "..";
import { Token, IToken } from '../typedef/types';
import { Collection } from "mongodb";
import { string } from './string';

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
      Generate: function(): void {
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
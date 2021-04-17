import { Mongo } from "..";
import { Token, IToken } from '../typedef/types';
import { Collection, ObjectID } from "mongodb";
import { string } from './string';

export let TOKEN = function (header: string): IToken {
   const [username, password] = header.split(":");
   const collection: Collection<Token> = Mongo.client.db("Mordor").collection("tokens");

   /** @private */
   let create = function(): string {
      // let token: string = string.Encode(`
      //    ${username}_
      //    ${password}_
      //    ${new Date().getHours()}_
      //    ${new Date().getMinutes()}_
      //    ${new Date().getSeconds()}
      // `);

      let token: string = string.Encode(`
         ${username}_
         ${password}_
      `);

      return token;
   };

   const emptyToken: Token = {
      Token: "",
      _id: new ObjectID(),
      password: "",
      username: ""
   }
   
   // let killToken = function(): void {
   //    collection.updateOne({ username: username }, { $set: { Token: null } }, { upsert: true });
   // };

   return {
      FindToken: async function(): Promise<string | null | undefined> {
         let x: Token | null = await collection.findOne({ username: username });
         return x?.Token;
      },

      Find: async function(): Promise<void> {
        // 
      },
      
      Generate: async function(): Promise<void> {
         var token: Token = await collection.findOne({username: username}) || emptyToken;
         // collection.findOne({username: username}).then((response: Token | null) => {
         //    console.log(response);
         //    token = response;
         // });

         token.Token
            ? collection.insertOne({ username: username, password: password, Token: create() })
            : collection.updateOne({ username: username, password: password }, { $set: { Token: create() } }, { upsert: true });
      }
   };
};
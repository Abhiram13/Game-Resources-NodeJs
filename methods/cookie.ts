import {LoginCredentials} from '../typedef/types';
import {Mongo} from '../index';
import e from "express";
import {User, NewUser, IToken, Token} from '../typedef/types';
import {Collection, MongoError} from 'mongodb';
import {TOKEN} from '../methods/token';
import {ServerResponse} from '../methods/response';
import {string} from '../methods/string';

export default class Cookie {
   static fetchFromHeaders(cookie: string): string {
      const cookies: string[] = cookie?.split(";") || [];
      var encodedAuthentication: string = "";

      for (var i = 0; i < cookies.length; i++) {
         const [name, value] = cookies[i].split("=");

         if (name.trimStart() === "authToken") {
            encodedAuthentication = value;
         }
      }

      return encodedAuthentication || "";
   }

   static create(body: LoginCredentials): string {
      return string.Encode(`${body.username}:${body.password}`);
   }

   static decode(cookie: string): void {
      console.log(this.fetchFromHeaders(cookie));
      // return string.Decode(cookie);
   }

   static async isCookieValid(request: e.Request, response: e.Response): Promise<void> {
      let collection: Collection<User> = Mongo?.client.db("Mordor").collection<User>("users");
   }
}
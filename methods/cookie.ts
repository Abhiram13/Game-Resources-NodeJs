import {LoginCredentials} from '../typedef/types';
import {Mongo} from '../index';
import e from "express";
import {User, NewUser, IToken, Token} from '../typedef/types';
import {Collection, MongoError} from 'mongodb';
import {TOKEN} from '../methods/token';
import {ServerResponse} from '../methods/response';
import {string} from '../methods/string';
import Http from 'http';

export default class Cookie {
   static fetchFromHeaders(headers: Http.IncomingHttpHeaders): string {
      const cookie: string = headers.cookie || "";
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

   /** @private */
   private static decode(cookie: string): LoginCredentials {
      const [usr, pwd] = string.Decode(cookie).split(":");

      return {
         password: pwd,
         username: usr
      }
   }

   static async isValid(headers: Http.IncomingHttpHeaders): Promise<boolean> {
      const COOKIE: string = this.fetchFromHeaders(headers);
      const USER_CRED: LoginCredentials = this.decode(COOKIE);
      const collection: Collection<User> = Mongo?.client.db("Mordor").collection<User>("users");
      const USER: User | null = await collection.findOne({username: USER_CRED.username});

      if (!USER || !USER.username) {
         return false;
      }

      return true;
   }
}
import { Mongo } from '../index';
import e from "express";
import { User, NewUser, IToken, Token } from '../typedef/types';
import { Collection, MongoError } from 'mongodb';
import { TOKEN } from '../methods/token';
import {ServerResponse} from '../methods/response';
import {string} from '../methods/string';

interface LoginResponse {
   user: User;
   token: string | null | undefined;
}

function Cookie(cookie: string): void {
   const cookies: string[] = cookie?.split(";") || [];
   var selectedCookie: string;

   console.log(cookies);

   for (var i = 0; i < cookies.length; i++) {
      const [name, value] = cookies[i].split("=");

      if (name.trimStart() === "authToken") {
         selectedCookie = value;
      }
   }
}

interface LoginCredentials {
   username: string;
   password: string;
}

function createCookie(body: LoginCredentials): string {
   return string.Encode(`${body.username}:${body.password}`);
}

function decodeCookie(cookie: string): string {
   return string.Decode(cookie);
}

async function isCookieValid(request: e.Request, response: e.Response): Promise<void> {
   let collection: Collection<User> = Mongo?.client.db("Mordor").collection<User>("users");   
}
/**
 * FISRT TIME LOGIN:::
 * After login, create cookie based on user credentials and send it back through response
 * Store that cookie and send it through request for all routes and check if the user is valid or not
 * 
 * NEXT TIME LOGIN:::
 * Since cookies will be stored in browser memory, at login / first route in client browser, check if cookie exist and is valid
 * if true, authenticate automatically
 * if false, let user login and repeat FIRST TIME LOGIN process
 * 
 * LOGOUT:::
 * Remove cookies
 */

export class Users {   
   static Login(request: e.Request, response: e.Response): void {
      try {
         let collection: Collection<User> = Mongo?.client.db("Mordor").collection<User>("users");

         collection.findOne({"username": request.body.username}, async function(error, document: User) {
            Cookie(request.headers['cookie'] || "");
            if (error || !document || !document.username) {
               new ServerResponse<string>("No User Found", response);
            } else {
               // TOKEN(`${document.username}:${document.password}`).Generate();
               let res = await TOKEN(`${document.username}:${document.password}`).FindToken();
               response
                  .status(200)
                  .header("Access-Control-Expose-Headers", "*")
                  .header("Access-Control-Allow-Credentials", "true")
                  .header("content-type", "application/json")
                  .cookie("authToken", res)
                  .send({"user": document, "token": res})
                  .end();
            }
         });
      } catch (e) {
         new ServerResponse<any>(e, response, 500);
      }
   }

   static async TokenCheck(request: e.Request, response: e.Response): Promise<void> {
      let collection: Collection<Token> = Mongo?.client.db("Mordor").collection<Token>("tokens");
      const str: string | undefined = request.headers['cookie']?.split(";")[0].split("=")[1];
      // str.re
      let x: Token | null = await collection.findOne({Token: str});
      response
         .status(200)
         .header("Access-Control-Expose-Headers", "*")
         .header("Access-Control-Allow-Credentials", "true")
         .send((x?.Token) ? true : false)
         .end();
   }

   static SignUp(request: e.Request, response: e.Response): void {
      try {         
         let collection: Collection<User> = Mongo.client.db("Mordor").collection<User>("users");
         collection.findOne({ "username": request.body.username }, function(err, doc) {

            if (doc && Object.keys(doc).length > 0) {
               new ServerResponse<string>("User already Existed", response, 302);
            } else if (!("firstname" in request.body) || !("lastname" in request.body) || !("password" in request.body) || !("isAdmin" in request.body)) {
               new ServerResponse<string>("Bad Request", response, 400);
            } else if (doc === null || doc === undefined) {
               let obj: NewUser = {
                  username: request.body.username,
                  firstname: request.body.firstname,
                  lastname: request.body.lastname,
                  password: request.body.password,
                  isAdmin: request.body.isAdmin,
               };
               collection.insertOne(obj);
               new ServerResponse<null>(null, response);
            }        
         });
      } catch (e) {
         new ServerResponse<any>(e, response, 500);
      }
   }
}
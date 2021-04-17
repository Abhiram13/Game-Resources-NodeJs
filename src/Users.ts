import { Mongo } from '../index';
import e from "express";
import { User, NewUser, IToken, Token } from '../typedef/types';
import { Collection } from 'mongodb';
import { TOKEN } from '../methods/token';
import { ServerResponse } from '../methods/response';

interface LoginResponse {
   user: User;
   token: string | null | undefined;
}

export class Users {   
   static Login(request: e.Request, response: e.Response): void {
      try {
         let collection: Collection<User> = Mongo?.client.db("Mordor").collection<User>("users");

         collection.findOne({ "username": request.body.username }, async function(err, doc: User) {
            if (err || doc === null || doc === undefined || Object.keys(doc).length === 0) {
               new ServerResponse<string>("No User Found", response);
            } else if (doc) {
               TOKEN(`${doc.username}:${doc.password}`).Generate();
               let res = await TOKEN(`${doc.username}:${doc.password}`).FindToken();
               response
                  .status(200)
                  .header("Access-Control-Expose-Headers", "*")
                  .header("Access-Control-Allow-Credentials", "true")
                  .header("content-type", "application/json")
                  .cookie("authToken", res)
                  .send({"user": doc, "token": res})
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
import {Mongo} from '../index';
import e from "express";
import {User, NewUser, LoginCredentials} from '../typedef/types';
import {Collection} from 'mongodb';
import {ServerResponse} from '../methods/response';
import Cookie from '../methods/cookie';

export class Users {
   static Login(request: e.Request, response: e.Response): void {
      try {
         let collection: Collection<User> = Mongo?.client.db("Mordor").collection<User>("users");         

         collection.findOne({"username": request.body.username}, async function(error, document: User) {
            if (error || !document || !document.username) {
               new ServerResponse<string>("No User Found", response);
               return;
            }

            const cookieValue: string = Cookie.create(request.body as LoginCredentials);
            response
               .status(200)
               .header("Access-Control-Expose-Headers", "*")
               .header("Access-Control-Allow-Credentials", "true")
               .header("content-type", "application/json")
               .cookie("authToken", cookieValue)
               .send({"user": document})
               .end();
         });
      } catch (e) {
         new ServerResponse<any>(e, response, 500);
      }
   }

   static SignUp(request: e.Request, response: e.Response): void {
      try {
         let collection: Collection<User> = Mongo.client.db("Mordor").collection<User>("users");
         collection.findOne({"username": request.body.username}, function(err, doc) {

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
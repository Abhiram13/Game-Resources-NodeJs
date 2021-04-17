import {Mongo} from '../index';
import e from "express";
import {User, NewUser, Token, LoginCredentials} from '../typedef/types';
import {Collection, MongoError} from 'mongodb';
import {ServerResponse} from '../methods/response';
import {string} from '../methods/string';
import Cookie from '../methods/cookie';

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
import { Mongo } from '../index';
import e from "express";
import { User, NewUser } from '../typedef/types';
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
            console.log(err);
            console.log(doc);
            if (err || doc === null || doc === undefined || Object.keys(doc).length === 0) {
               new ServerResponse<string>("No User Found", response);
            } else if (doc) {
               TOKEN(`${doc.username}:${doc.password}`).Generate();
               let res = await TOKEN(`${doc.username}:${doc.password}`).FindToken();
               new ServerResponse<LoginResponse>({ "user": doc, "token": res }, response);
            }
         });
      } catch (e) {
         console.log(e);
         response.status(500).send(e).end();
      }
   }

   static SignUp(request: e.Request, response: e.Response): void {
      try {         
         let collection: Collection<User> = Mongo.client.db("Mordor").collection<User>("users");
         collection.findOne({ "username": request.body.username }, function(err, doc) {

            if (doc && Object.keys(doc).length > 0) {
               response.status(302).send("User already exist").end();
            } else if (!("firstname" in request.body) || !("lastname" in request.body) || !("password" in request.body) || !("isAdmin" in request.body)) {
               response.status(400).send("Bad Request").end();
            } else if (doc === null || doc === undefined) {
               let obj: NewUser = {
                  username: request.body.username,
                  firstname: request.body.firstname,
                  lastname: request.body.lastname,
                  password: request.body.password,
                  isAdmin: request.body.isAdmin,
               };
               collection.insertOne(obj);
               response.status(200).end();
            }        
         });
      } catch (e) {
         response.status(500).send(e).end();
      }
   }

   static Like(): void {
      
   }
}
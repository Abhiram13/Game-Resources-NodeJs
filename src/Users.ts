import { Mongo, app } from '../index';
import { Application } from "express";
import e from "express";
import { User, NewUser } from '../typedef/types';
import { Collection, Cursor } from 'mongodb';
import { json } from 'body-parser';
import { TOKEN } from '../helpers/helper';

export class Users {
   static Login(request: e.Request, response: e.Response): void {
      try {
         Mongo.client.db("Mordor").collection<User>("users").findOne({ "username": request.body.username }, async function(err, doc) {
            if (err || Object.keys(doc).length === 0) {
               response.status(400).send({ "message": "No User Found" }).end();
            } else if (doc) {
               TOKEN.generate(`${doc.username}:${doc.password}`);
               let res = await TOKEN.findToken(`${doc.username}:${doc.password}`).then(resp => { return resp; });
               console.log(res);
               response.status(200).send({ "user": doc, "token": res });
            }
         });
      } catch (e) {
         console.log(e);
         response.status(500).send(e).end();
      }
   }

   static SignUp(request: e.Request, response: e.Response): void {
      try {
         // Mongo.client.db("Mordor").collection("tokens").insertOne({ username: username, password: password, Token: this.create(header) });
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
            console.log(doc);
            console.log(err);            
         });
      } catch (e) {
         console.log(e);
         response.status(500).send(e).end();
      }
   }
}
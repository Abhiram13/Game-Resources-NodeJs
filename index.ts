import { Application } from "express";
import e from "express";
import { Collection, Cursor, Db, MongoClient } from "mongodb";
import { Authorisation, TOKEN } from './helpers/helper';
import { Item } from './src/Items';
import { Items } from "./typedef/types";

export const app: Application = e();

export class Mongo {
   static URI: string = "mongodb+srv://abhiramDB:abhiram13@myfirstdatabase.l8kvg.mongodb.net/Mordor?retryWrites=true&w=majority";
   static client: MongoClient = new MongoClient(Mongo.URI, { useUnifiedTopology: true });   
   static async Connect(): Promise<void> {
      try {
         await Mongo.client.connect();
         Mongo.client.db("Mordor");         
      } catch (e: any) {
         console.log(e.Message);
      }
   }
}

app.get("/", function(req: e.Request, res: e.Response) {   
   if (Authorisation.Headers(req.headers.authorization!)) {
      // Item.FetchAll()
      //    .then((response: Items[] | null) => {
      //       res.status(200).send({RESPONSE: response, TOKEN: TOKEN.generate().then(token => {return token})});
      //    });
      TOKEN.generate(req.headers.authorization!);
      res.send("OK");
   } else {
      res.status(400).send("Bad Request");
   }  
});

app.get("/kill", function(req: e.Request, res: e.Response) {
   if (Authorisation.Headers(req.headers.authorization!)) {
      // Item.FetchAll()
      //    .then((response: Items[] | null) => {
      //       res.status(200).send({RESPONSE: response, TOKEN: TOKEN.generate().then(token => {return token})});
      //    });
      TOKEN.killToken(req.headers.authorization!);
      res.send("OK");
   } else {
      res.status(400).send("Bad Request");
   }
});

app.listen(1996, function() {
   Mongo.Connect();
   console.log('Example app listening on port 1996!');
});
import { Application, NextFunction } from "express";
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

app.all("/item/*", function(req: e.Request, res: e.Response, next: NextFunction) { 
   if (Authorisation.Headers(req.headers.authorization!)) {
      TOKEN.generate(req.headers.authorization!);
      console.log("HIT");
      next();
   } else {
      res.status(401).send("UnAuthorised");
      res.end();
   }
});

app.get("/", function(req: e.Request, res: e.Response) {   
   res.send("Sent Data");
});

app.get("/second", function(req: e.Request, res: e.Response) {
   if (Authorisation.Headers(req.headers.authorization!)) {      
      res.send(TOKEN.findToken(req.headers.authorization!));
   } else {
      res.status(400).send("Bad Request");
   }
});

app.get("/item/findall", (req: e.Request, res: e.Response) => Item.FetchAll(req, res));
app.get("/item/findone/:id", (req: e.Request, res: e.Response) => Item.FindById(req, res));

app.listen(1996, function() {
   Mongo.Connect();
   console.log('Example app listening on port 1996!');
});
import { Application } from "express";
import e from "express";
import { Collection, Cursor, Db, MongoClient } from "mongodb";
import { Authorisation } from './helpers/helper';

const app: Application = e();

class Mongo {
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
      res.status(200).send("Request OK");
   } else {
      res.status(400).send("Bad Request");
   }  
});

app.listen(1996, function() {
   // Connects to MongoDB when starts listening
   Mongo.Connect();
   console.log('Example app listening on port 1996!');
});
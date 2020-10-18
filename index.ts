import { Application } from "express";
import e from "express";
import { Collection, Cursor, Db, MongoClient } from "mongodb";
import { Items } from './typedef/types';

const app: Application = e();

class Mongo {
   static URI: string = "mongodb+srv://abhiramDB:abhiram13@myfirstdatabase.l8kvg.mongodb.net/Mordor?retryWrites=true&w=majority";
   static client: MongoClient = new MongoClient(Mongo.URI, { useUnifiedTopology: true });
   static Database: Db = Mongo.client.db("Mordor");
   static async Connect(): Promise<void> {
      try {
         await Mongo.client.connect();
      } catch (e: any) {
         console.log(e.Message);
      }
   }
}

app.get("/", function(req: e.Request, res: e.Response) {
   res.send("Hello");
});

app.listen(1996, function() {
   // Connects to MongoDB when starts listening
   Mongo.Connect();
   console.log('Example app listening on port 1996!');
});
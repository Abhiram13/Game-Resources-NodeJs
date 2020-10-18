import { Application } from "express";
import e from "express";
import { Collection, Cursor, Db, MongoClient, MongoError } from "mongodb";
import { Items } from './typedef/types';

const mongo: MongoClient = require("mongodb");
const app: Application = e();
const uri: string = "mongodb+srv://abhiramDB:abhiram13@myfirstdatabase.l8kvg.mongodb.net/Mordor?retryWrites=true&w=majority";

async function connectToDB(): Promise<Items[] | null> {
   const client: MongoClient = new MongoClient(uri, { useUnifiedTopology: true });
   try {
      await client.connect();
      const mordor: Db = client.db("Mordor");
      const collections: Collection<Items> = mordor.collection<Items>("items");
      let item: Cursor<Items> = collections.find({});
      let itemsCollection: Items[] = await item.toArray();
      return itemsCollection;
   } catch (e) {
      return null;
   }
}
app.get("/", function(req: e.Request, res: e.Response) {
   res.send("Hello");
});

app.listen(1996, function() {
   connectToDB().then((res) => res);
   console.log('Example app listening on port 1996!');
});
import { Application } from "express";
import e from "express"
import { Collection, Cursor, MongoClient, MongoError } from "mongodb";
import { Items } from './typedef/types';

const mongo: MongoClient = require("mongodb");
const app: Application = e();
const uri: string = "mongodb+srv://abhiramDB:abhiram13@myfirstdatabase.l8kvg.mongodb.net/Mordor?retryWrites=true&w=majority";

async function connectToDB(): Promise<Items[] | null> {
     const client: MongoClient = new MongoClient(uri, { useUnifiedTopology: true });
     var array: string[] = [];
     try {
          await client.connect();          
          const collections: Collection<Items> = client.db("Mordor").collection<Items>("items");
          let item: Cursor<Items> = collections.find({});          
          let itemsCollection: Items[] = await item.toArray();
          return itemsCollection;
     } catch (e) {
          // console.log(e);
          return null;
     }
}
app.get("/", function(req: e.Request, res: e.Response) {
     res.send("Hello");
});

app.listen(1996, function() {
     connectToDB().then((res) => console.log(res));
     console.log('Example app listening on port 1996!');
});
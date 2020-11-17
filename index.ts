import { Application, NextFunction } from "express";
import e from "express";
import bodyparser from "body-parser";
import { MongoClient, ObjectID } from "mongodb";
import { Authorisation, Database } from './helpers/helper';
import { Users } from './src/Users';
import { Items, User } from "./typedef/types";

const cors = require('cors');

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

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(cors());

app.all(["/item/*", "/users/*"], async function(req: e.Request, res: e.Response, next: NextFunction) {
   if (await Authorisation.Token(req.headers.token!)) {
      next();
   } else {
      res.status(401).send("UnAuthorised").end();
   }
});

app.get("/", function(req: e.Request, res: e.Response) {   
   res.send("Sent Data");
});

app.get("/item/findall", (req: e.Request, res: e.Response) => {
   Database<Items, string>("items", "").FindAll(req, res);
});

app.get("/item/findone/:id", (req: e.Request, res: e.Response) => {
   Database<Items, { _id: ObjectID; }>("items", { "_id": new ObjectID(req.params.id) }).FindById(req, res);
});

app.post("/item/search", (req: e.Request, res: e.Response) => {
   Database<Items, string>("items", "itemName").Search(req, res);
});

app.post("/login", (req: e.Request, res: e.Response) => {
   Users.Login(req, res);
});

app.post("/signin", (req: e.Request, res: e.Response) => {
   Users.SignUp(req, res);
})

app.get("/users/findall", (req: e.Request, res: e.Response) => {
   Database<User, string>("users", "").FindAll(req, res);
});

// app.post("/update/:id", (request: e.Request, response: e.Response) => {
//    Item.Update(request, response);
// });

app.listen(1996, function() {
   Mongo.Connect();
   console.log('Example app listening on port 1996!');
});
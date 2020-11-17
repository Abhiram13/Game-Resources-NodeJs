import { Application, NextFunction } from "express";
import e from "express";
import bodyparser from "body-parser";
import { MongoClient } from "mongodb";
import { Authorisation } from './helpers/helper';
import { Users } from './src/Users';
import userRouter from './routes/users';
import itemRouter from './routes/items';

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

app.use('/item', itemRouter);
app.use('/users', userRouter);

app.get("/", function(req: e.Request, res: e.Response) {   
   res.send("Sent Data");
});

app.post("/login", (req: e.Request, res: e.Response) => {
   Users.Login(req, res);
});

app.post("/signin", (req: e.Request, res: e.Response) => {
   Users.SignUp(req, res);
});

app.listen(1996, function() {
   Mongo.Connect();
   console.log('Example app listening on port 1996!');
});
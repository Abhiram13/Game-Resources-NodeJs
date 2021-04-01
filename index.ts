import { Application, NextFunction } from "express";
import e from "express";
import bodyparser from "body-parser";
import { MongoClient } from "mongodb";
import { Authorisation } from './methods/auth';
import { Users } from './src/Users';
import userRouter from './routes/userRouter';
import itemRouter from './routes/itemRouter';
import config from './config';
import http from "http";

const cors = require('cors');
const port = process.env.PORT || 1996;
const { cluster, dbname, password, username } = config;

export const app: Application = e();
export class Mongo {
   static URI: string = `mongodb+srv://${username}:${password}@myfirstdatabase.l8kvg.mongodb.net/${cluster}?retryWrites=true&w=majority`;
   static client: MongoClient = new MongoClient(Mongo.URI, { useUnifiedTopology: true });
   static async Connect(): Promise<void> {
      try {
         await Mongo.client.connect();
         Mongo.client.db(dbname);
      } catch (e: any) {
         console.log(e.Message);
      }
   }
}

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(cors());

app.all(["/item/*", "/users/*"], async function(req: e.Request, res: e.Response, next: NextFunction) {
   await Authorisation.Token(req.headers.token!)
      ? next()
      : res.status(401).send("UnAuthorised").end();
});

app.use('/item', itemRouter);
app.use('/users', userRouter);

app.post("/", function(req: e.Request, res: e.Response) {
   res.header("content-type", "application/text").send("Sent Data").end();
});

app.post("/login", Users.Login);

app.post("/signin", Users.SignUp);

function ServerStart(): void {
   Mongo.Connect();
   console.log(`App listening on port ${port}!`);
}

const server: http.Server = app.listen(port, ServerStart);
server.timeout = 300000;
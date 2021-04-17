import { Application, NextFunction } from "express";
import e from "express";
import bodyparser from "body-parser";
import { MongoClient } from "mongodb";
import { Users } from './src/Users';
import userRouter from './routes/userRouter';
import itemRouter from './routes/itemRouter';
import config from './config';
import http from "http";
import Cookie from './methods/cookie';

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
   await await Cookie.isValid(req.headers)
      ? next()
      : res.status(401).send("UnAuthorised").end();
});

app.use('/item', itemRouter);
app.use('/users', userRouter);

app.get("/checkToken", async function(req, res) {
   const isCookieValid: boolean = await Cookie.isValid(req.headers);
   const status: number = isCookieValid ? 202 : 511;
   const message: string = isCookieValid ? "true" : "false";

   res
      .status(status)
      .header("content-type", "application/text")
      .send(message)
      .end();
});

app.post("/login", Users.Login);

app.post("/signin", Users.SignUp);

function ServerStart(): void {
   Mongo.Connect();
   console.log(`App listening on port ${port}!`);
}

const server: http.Server = app.listen(port, ServerStart);
server.timeout = 300000;
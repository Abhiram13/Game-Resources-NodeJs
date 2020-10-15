import { Application } from "express";
import express = require("express");
const app:Application = express();

app.get('/', function(req: express.Request, res: express.Response) {
     res.send('Hello World!');
});

app.listen(1996, function() {
     console.log('Example app listening on port 1996!');
});
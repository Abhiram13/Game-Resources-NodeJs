"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mongo = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongodb_1 = require("mongodb");
const auth_1 = require("./methods/auth");
const Users_1 = require("./src/Users");
const users_1 = __importDefault(require("./routes/users"));
const items_1 = __importDefault(require("./routes/items"));
const cors = require('cors');
const port = process.env.PORT || 1996;
exports.app = express_1.default();
class Mongo {
    ;
    static Connect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield Mongo.client.connect();
                Mongo.client.db("Mordor");
            }
            catch (e) {
                console.log(e.Message);
            }
        });
    }
}
exports.Mongo = Mongo;
Mongo.URI = "mongodb+srv://abhiramDB:abhiram13@myfirstdatabase.l8kvg.mongodb.net/Mordor?retryWrites=true&w=majority";
Mongo.client = new mongodb_1.MongoClient(Mongo.URI, { useUnifiedTopology: true });
exports.app.use(body_parser_1.default.urlencoded({ extended: true }));
exports.app.use(body_parser_1.default.json());
exports.app.use(cors());
exports.app.all(["/item/*", "/users/*"], function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        (yield auth_1.Authorisation.Token(req.headers.token))
            ? next()
            : res.status(401).send("UnAuthorised").end();
    });
});
exports.app.use('/item', items_1.default);
exports.app.use('/users', users_1.default);
exports.app.get("/", function (req, res) {
    res.send("Sent Data");
});
exports.app.post("/login", (req, res) => {
    Users_1.Users.Login(req, res);
});
exports.app.post("/signin", (req, res) => {
    Users_1.Users.SignUp(req, res);
});
exports.app.listen(port, function () {
    Mongo.Connect();
    console.log(`App listening on port ${port}!`);
});

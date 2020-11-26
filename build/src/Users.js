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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users = void 0;
const index_1 = require("../index");
const token_1 = require("../methods/token");
class Users {
    static Login(request, response) {
        try {
            index_1.Mongo.client.db("Mordor").collection("users").findOne({ "username": request.body.username }, function (err, doc) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (err || doc === null || doc === undefined || Object.keys(doc).length === 0) {
                        response.status(400).send({ "message": "No User Found" }).end();
                    }
                    else if (doc) {
                        token_1.TOKEN(`${doc.username}:${doc.password}`).Generate();
                        let res = yield token_1.TOKEN(`${doc.username}:${doc.password}`).FindToken().then(resp => { return resp; });
                        response.status(200).send({ "user": doc, "token": res });
                    }
                });
            });
        }
        catch (e) {
            response.status(500).send(e).end();
        }
    }
    static SignUp(request, response) {
        try {
            let collection = index_1.Mongo.client.db("Mordor").collection("users");
            collection.findOne({ "username": request.body.username }, function (err, doc) {
                if (doc && Object.keys(doc).length > 0) {
                    response.status(302).send("User already exist").end();
                }
                else if (!("firstname" in request.body) || !("lastname" in request.body) || !("password" in request.body) || !("isAdmin" in request.body)) {
                    response.status(400).send("Bad Request").end();
                }
                else if (doc === null || doc === undefined) {
                    let obj = {
                        username: request.body.username,
                        firstname: request.body.firstname,
                        lastname: request.body.lastname,
                        password: request.body.password,
                        isAdmin: request.body.isAdmin,
                    };
                    collection.insertOne(obj);
                    response.status(200).end();
                }
            });
        }
        catch (e) {
            response.status(500).send(e).end();
        }
    }
    static Like() {
    }
}
exports.Users = Users;

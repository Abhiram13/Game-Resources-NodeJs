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
exports.TOKEN = exports.Authorisation = exports.String = void 0;
const __1 = require("..");
class String {
    static Encode(string) {
        let bufferObj = Buffer.from(string, "utf8");
        let base64String = bufferObj.toString("base64");
        return base64String;
    }
    static Decode(string) {
        let buffer = Buffer.from(string, "base64");
        let decode = buffer.toString("utf8");
        return decode;
    }
}
exports.String = String;
class Authorisation {
    static Headers(headers) {
        try {
            const [username, password] = headers.split(":");
            if (username === "abhi" && password === "123")
                return true;
        }
        catch (e) {
            console.log(e);
        }
        return false;
    }
}
exports.Authorisation = Authorisation;
class TOKEN {
    static create(header) {
        const [username, password] = header.split(":");
        let Token = String.Encode(`${username}_${password}_${new Date().getHours()}_${new Date().getMinutes()}_${new Date().getSeconds()}`);
        return Token;
    }
    static killToken(header) {
        const [username, password] = header.split(":");
        __1.Mongo.client.db("Mordor").collection("tokens").updateOne({ username: username }, { $set: { Token: null } }, { upsert: true });
    }
    static generate(header) {
        const [username, password] = header.split(":");
        let isTokenExit = null;
        __1.Mongo.client.db("Mordor").collection("tokens").findOne({ username: 'abhi' })
            .then(function (response) {
            isTokenExit = response;
        });
        if (isTokenExit === null) {
            __1.Mongo.client.db("Mordor").collection("tokens").updateOne({ username: username, password: password }, { $set: { Token: this.create(header) } }, { upsert: true });
        }
        else {
            __1.Mongo.client.db("Mordor").collection("tokens").insertOne({ username: username, password: password, Token: this.create(header) });
        }
        (() => __awaiter(this, void 0, void 0, function* () {
            let promise = new Promise((resolve, reject) => {
                setTimeout(() => this.killToken(header), 20000);
            });
            yield promise;
        }))();
    }
    static findToken(header) {
        return __awaiter(this, void 0, void 0, function* () {
            const [username, password] = header.split(":");
            let tokenObject = yield __1.Mongo.client.db("Mordor").collection("tokens").findOne({ username: username });
            console.log(tokenObject === null || tokenObject === void 0 ? void 0 : tokenObject.Token);
        });
    }
}
exports.TOKEN = TOKEN;

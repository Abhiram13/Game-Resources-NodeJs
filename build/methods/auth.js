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
exports.Authorisation = void 0;
const __1 = require("..");
class Authorisation {
    static Headers(headers) {
        try {
            const [username, password] = headers.split(":");
            if (username === "abhi" && password === "123")
                return true;
        }
        catch (e) { }
        return false;
    }
    static Token(token) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!token)
                return false;
            let document = yield __1.Mongo.client.db("Mordor").collection("tokens").findOne({ "Token": token });
            return (document && Object.keys(document).length > 0) ? true : false;
        });
    }
}
exports.Authorisation = Authorisation;

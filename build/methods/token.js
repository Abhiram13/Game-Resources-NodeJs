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
exports.TOKEN = void 0;
const __1 = require("..");
const string_1 = require("./string");
exports.TOKEN = function (header) {
    const [username, password] = header.split(":");
    const collection = __1.Mongo.client.db("Mordor").collection("tokens");
    /** @private */
    let create = function () {
        let token = string_1.string.Encode(`
         ${username}_
         ${password}_
         ${new Date().getHours()}_
         ${new Date().getMinutes()}_
         ${new Date().getSeconds()}
      `);
        return token;
    };
    /** @private */
    let killToken = function () {
        collection.updateOne({ username: username }, { $set: { Token: null } }, { upsert: true });
    };
    return {
        FindToken: function () {
            return __awaiter(this, void 0, void 0, function* () {
                let x = yield collection.findOne({ username: username });
                return x === null || x === void 0 ? void 0 : x.Token;
            });
        },
        Generate: function () {
            let token = null;
            collection.findOne({ username: username }).then((response) => { token = response; });
            token
                ? collection.insertOne({ username: username, password: password, Token: create() })
                : collection.updateOne({ username: username, password: password }, { $set: { Token: create() } }, { upsert: true });
            (() => __awaiter(this, void 0, void 0, function* () {
                let promise = new Promise((resolve, reject) => {
                    setTimeout(() => killToken(), 60000);
                });
                yield promise;
            }))();
        }
    };
};

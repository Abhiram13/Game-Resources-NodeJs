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
exports.Item = void 0;
const index_1 = require("../index");
const mongodb_1 = require("mongodb");
class Item {
    static Update(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let obj = function () {
                    let x = {};
                    for (var key in request.body) {
                        x[key] = request.body[key];
                    }
                    return x;
                };
                yield index_1.Mongo.client.db("Mordor").collection("items").updateOne({ _id: new mongodb_1.ObjectID(request.params.id) }, { $set: obj() }, { upsert: true }, function (er, result) {
                    console.log(result);
                });
            }
            catch (e) {
                //
            }
        });
    }
}
exports.Item = Item;

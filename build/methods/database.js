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
exports.Database = void 0;
const __1 = require("..");
function Database(collection, options) {
    let database = __1.Mongo.client.db("Mordor").collection(collection);
    return {
        FindAll: () => __awaiter(this, void 0, void 0, function* () { return yield database.find({}).toArray(); }),
        FindById: () => __awaiter(this, void 0, void 0, function* () { return yield database.findOne(options); }),
        Search: (request) => __awaiter(this, void 0, void 0, function* () {
            if (options) {
                let array = yield database.find({}).toArray();
                let items = [];
                let string = request.body.string;
                for (let i = array.length; i--;) {
                    let item = array[i];
                    if (item[options].substring(0, string.length).toUpperCase() === string.toUpperCase()) {
                        items.push(array[i]);
                    }
                }
                return items;
            }
            return yield database.find({}).toArray();
        }),
        Update: (query) => __awaiter(this, void 0, void 0, function* () {
            let updated = yield database.updateOne(query, { $set: options }, { upsert: true });
            return updated;
        }),
    };
}
exports.Database = Database;

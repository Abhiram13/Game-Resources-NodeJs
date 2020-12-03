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
const express_1 = __importDefault(require("express"));
const database_1 = require("../methods/database");
const mongodb_1 = require("mongodb");
const response_1 = require("../methods/response");
const itemRouter = express_1.default.Router();
itemRouter.get('/findone/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const obj = {
        _id: new mongodb_1.ObjectID(req.params.id),
    };
    try {
        let item = yield database_1.Database("items", obj).FindById();
        new response_1.ServerResponse(item, res).Send();
    }
    catch (e) {
        new response_1.ServerResponse(e, res, 400).Send();
    }
}));
itemRouter.post('/search', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let items = yield database_1.Database("items", "itemName").Search(req);
        new response_1.ServerResponse(items, res).Send();
    }
    catch (e) {
        new response_1.ServerResponse(e, res, 400).Send();
    }
}));
itemRouter.get('/findall', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let items = yield database_1.Database("items", "").FindAll();
        new response_1.ServerResponse(items, res).Send();
    }
    catch (e) {
        new response_1.ServerResponse(e, res, 400).Send();
    }
}));
itemRouter.post('/update', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let id = {
            "_id": new mongodb_1.ObjectID(req.body._id),
        };
        let name = {
            itemName: "Blue Milk"
        };
        let count = yield database_1.Database("items", name)
            .Update(id);
        new response_1.ServerResponse(count.modifiedCount, res).Send();
    }
    catch (e) {
        new response_1.ServerResponse(e, res, 400).Send();
    }
}));
exports.default = itemRouter;

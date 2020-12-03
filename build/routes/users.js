"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_1 = require("../methods/database");
const userRouter = express_1.default.Router();
userRouter.get('/findall', (req, res) => database_1.Database("users", "").FindAll());
userRouter.post('/search', (req, res) => database_1.Database("users", "firstname").Search(req));
exports.default = userRouter;

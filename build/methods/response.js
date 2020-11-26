"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerResponse = void 0;
class ServerResponse {
    constructor(Data, Res, Status = 200) {
        this.data = Data;
        this.response = Res;
        this.status = Status;
    }
    Send() {
        this.response.status(this.status).send(this.data).end();
    }
}
exports.ServerResponse = ServerResponse;

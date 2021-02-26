import express from "express";

export class ServerResponse<DataType> {
   data: DataType; response: express.Response; status: number;

   constructor(Data: DataType, Res: express.Response, Status: number = 200) {
      this.data = Data;
      this.response = Res;
      this.status = Status;
      this.response.status(this.status).send(this.data).end();
   }
}
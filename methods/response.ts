import express from "express";

export class ServerResponse<T> {
   data: T; response: express.Response; status: number;

   constructor(Data: T, Res: express.Response, Status: number = 200) {
      this.data = Data;
      this.response = Res;
      this.status = Status;
   }

   Send(): void {
      this.response.status(this.status).send(this.data).end();
   }
}
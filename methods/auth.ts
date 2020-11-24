import { Mongo } from "..";

export class Authorisation {
   static Headers(headers: string): boolean {
      try {
         const [username, password] = headers.split(":");
         if (username === "abhi" && password === "123") return true;
      } catch (e) { }
      return false;
   }

   static async Token(token: string | string[] | undefined): Promise<boolean> {
      if (!token) return false;

      let document = await Mongo.client.db("Mordor").collection("tokens").findOne({ "Token": token });

      return (document && Object.keys(document).length > 0) ? true : false;
   }
}
import { ObjectID } from "mongodb";

export interface Items {
   _id: ObjectID,
   itemName: string,
   description: string,
   category: string,
   imageURL: string,
   rating: number,
   categoryLogo: string,
}

export interface Token {
   _id: ObjectID,
   username: string,
   password: string,
   Token: string | null,
}
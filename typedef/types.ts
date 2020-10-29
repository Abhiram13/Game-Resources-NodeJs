import { ObjectID } from "mongodb";

export interface Items {
   _id: ObjectID | string,
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

export interface NewUser {
   username: string,
   password: string,
   firstname: string,
   lastname: string,
   isAdmin: boolean,
}

export interface User extends NewUser {
   _id: ObjectID,
   __v: number,
}
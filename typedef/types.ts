import { ObjectID } from "mongodb";
import e from "express";

export interface Items {
   _id: ObjectID | string,
   itemName: string,
   description: string,
   category: string,
   imageURL: string,
   rating: number,
   categoryLogo: string,
   [key: string]: string | number | ObjectID,
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
   [key: string]: string | number | ObjectID | boolean | undefined,
}

export interface User extends NewUser {
   _id?: ObjectID,
   __v?: number,
}

export interface IString {
   Encode: (string: string) => string,
   Decode: (string: string) => string,
}

export interface IToken {
   Generate: (header: string) => void,
   FindToken: (header: string) => Promise<string | null | undefined>,
}

export interface IOperations {
   FindAll: (request: e.Request, response: e.Response) => Promise<void>,
   FindById: (request: e.Request, response: e.Response) => Promise<void>,
   Search: (request: e.Request, response: e.Response) => Promise<void>,
}
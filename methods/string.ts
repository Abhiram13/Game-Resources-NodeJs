import { IString } from '../typedef/types';

export let string = function(): IString {
   return {
      Encode: function(string) {
         let bufferObj: Buffer = Buffer.from(string, "utf8");
         let base64String: string = bufferObj.toString("base64");
         return base64String;
      },
      Decode: function(string) {
         let buffer: Buffer = Buffer.from(string, "base64");
         let decode: string = buffer.toString("utf8");
         return decode;
      }
   };
}();
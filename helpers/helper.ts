export default class String {
   static Encode(string: string): string {
      let bufferObj: Buffer = Buffer.from(string, "utf8");
      let base64String: string = bufferObj.toString("base64");
      return base64String;
   }

   static Decode(string: string): string {
      let buffer: Buffer = Buffer.from(string, "base64");
      let decode: string = buffer.toString("utf8");
      return decode;
   }
}
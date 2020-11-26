"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.string = void 0;
exports.string = function () {
    return {
        Encode: function (string) {
            let bufferObj = Buffer.from(string, "utf8");
            let base64String = bufferObj.toString("base64");
            return base64String;
        },
        Decode: function (string) {
            let buffer = Buffer.from(string, "base64");
            let decode = buffer.toString("utf8");
            return decode;
        }
    };
}();

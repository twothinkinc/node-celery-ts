"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBase64Encoder = exports.createPlaintextEncoder = void 0;
const createPlaintextEncoder = () => ({
    encode: (data) => data.toString("utf8"),
    decode: (data) => Buffer.from(data, "utf8"),
});
exports.createPlaintextEncoder = createPlaintextEncoder;
const createBase64Encoder = () => ({
    encode: (data) => data.toString("base64"),
    decode: (data) => Buffer.from(data, "base64"),
});
exports.createBase64Encoder = createBase64Encoder;
//# sourceMappingURL=encoder.js.map
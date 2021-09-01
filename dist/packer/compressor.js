"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createZlibCompressor = exports.createGzipCompressor = exports.createIdentityCompressor = void 0;
const Zlib = require("zlib");
const createIdentityCompressor = () => ({
    compress: (buffer) => Buffer.from(buffer),
    decompress: (buffer) => Buffer.from(buffer),
});
exports.createIdentityCompressor = createIdentityCompressor;
const createGzipCompressor = () => ({
    compress: (buffer) => Zlib.gzipSync(buffer),
    decompress: (buffer) => Zlib.unzipSync(buffer),
});
exports.createGzipCompressor = createGzipCompressor;
const createZlibCompressor = () => ({
    compress: (buffer) => Zlib.deflateSync(buffer),
    decompress: (buffer) => Zlib.unzipSync(buffer),
});
exports.createZlibCompressor = createZlibCompressor;
//# sourceMappingURL=compressor.js.map
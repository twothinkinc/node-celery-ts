"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createYamlSerializer = exports.createJsonSerializer = void 0;
const JsYaml = require("js-yaml");
const createJsonSerializer = () => ({
    serialize: (data) => Buffer.from(JSON.stringify(data), "utf8"),
    deserialize: (data) => JSON.parse(data.toString("utf8")),
});
exports.createJsonSerializer = createJsonSerializer;
const createYamlSerializer = () => ({
    serialize: (data) => Buffer.from(JsYaml.safeDump(data), "utf8"),
    deserialize: (data) => JsYaml.safeLoad(data.toString("utf8")),
});
exports.createYamlSerializer = createYamlSerializer;
//# sourceMappingURL=serializer.js.map
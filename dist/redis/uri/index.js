"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseSentinelUri = exports.parseSocket = exports.parseTcp = void 0;
var tcp_1 = require("./tcp");
Object.defineProperty(exports, "parseTcp", { enumerable: true, get: function () { return tcp_1.parse; } });
var socket_1 = require("./socket");
Object.defineProperty(exports, "parseSocket", { enumerable: true, get: function () { return socket_1.parse; } });
var sentinel_1 = require("./sentinel");
Object.defineProperty(exports, "parseSentinelUri", { enumerable: true, get: function () { return sentinel_1.parseSentinelUri; } });
//# sourceMappingURL=index.js.map
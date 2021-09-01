"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseRedisQuery = void 0;
const query_parser_1 = require("../../query_parser");
const utility_1 = require("../../utility");
const parseRedisQuery = (uri) => {
    if ((0, utility_1.isNullOrUndefined)(uri.query)) {
        return {};
    }
    const parser = new query_parser_1.QueryParser([
        { source: "password" },
        (0, query_parser_1.createBooleanQueryDescriptor)("noDelay"),
    ]);
    return parser.parse(uri.query, {});
};
exports.parseRedisQuery = parseRedisQuery;
//# sourceMappingURL=common.js.map
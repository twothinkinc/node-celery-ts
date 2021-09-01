"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseSentinelUri = void 0;
const errors_1 = require("../../errors");
const query_parser_1 = require("../../query_parser");
const uri_1 = require("../../uri");
const utility_1 = require("../../utility");
const parseSentinelUri = (rawUris) => {
    const split = rawUris.split(";");
    const parsed = split.map(parseIndividual);
    const sentinels = parsed.map(([sentinel, _]) => sentinel);
    const individualOptions = parsed.map(([_, query]) => query);
    const options = individualOptions.reduce((lhs, rhs) => (Object.assign(Object.assign({}, lhs), rhs)));
    if ((0, utility_1.isNullOrUndefined)(options.name)) {
        throw new errors_1.ParseError("sentinel options missing name");
    }
    return Object.assign(Object.assign({}, options), { protocol: "sentinel", sentinels });
};
exports.parseSentinelUri = parseSentinelUri;
const parseIndividual = (rawUri) => {
    const uri = (0, uri_1.parseUri)(rawUri);
    const authority = parseAuthority(uri);
    const queries = parseQueries(uri);
    return [authority, queries];
};
const parseAuthority = (uri) => {
    const scheme = (0, uri_1.getScheme)(uri.raw);
    if (!isSentinelScheme(scheme)) {
        throw new errors_1.ParseError(`URI ${uri.raw} is not a sentinel URI.`);
    }
    else if ((0, utility_1.isNullOrUndefined)(uri.authority)) {
        throw new errors_1.ParseError(`URI ${uri.raw} is missing its authority.`);
    }
    else if ((0, utility_1.isNullOrUndefined)(uri.authority.port)) {
        throw new errors_1.ParseError(`URI "${uri.raw}" is missing a port.`);
    }
    return {
        host: uri.authority.host,
        port: uri.authority.port,
    };
};
const parseQueries = (uri) => {
    if ((0, utility_1.isNullOrUndefined)(uri.query)) {
        return {};
    }
    const rawQuery = uri.query;
    const parser = new query_parser_1.QueryParser([
        { source: "name" },
        { parser: (x) => parseRole((0, query_parser_1.asScalar)(x)), source: "role" },
    ]);
    return parser.parse(rawQuery, {});
};
const isSentinelScheme = (scheme) => scheme === uri_1.Scheme.RedisSentinel || scheme === uri_1.Scheme.RedisSentinelSecure;
const parseRole = (role) => {
    if (role !== "master" && role !== "slave") {
        throw new errors_1.ParseError(`role "${role}" is not "master" or "slave"`);
    }
    return role;
};
//# sourceMappingURL=sentinel.js.map
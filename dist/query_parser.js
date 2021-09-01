"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asArray = exports.asScalar = exports.createPathQueryDescriptor = exports.createPathArrayQueryDescriptor = exports.createIntegerQueryDescriptor = exports.createBooleanQueryDescriptor = exports.QueryParser = void 0;
const errors_1 = require("./errors");
const utility_1 = require("./utility");
const Fs = require("fs");
class QueryParser {
    constructor(descriptors) {
        const withParsers = QueryParser.assertParsers(descriptors);
        const withTargets = QueryParser.assertTargets(withParsers);
        const asPairs = QueryParser.intoPairs(withTargets);
        this.functions = new Map(asPairs);
    }
    parse(query, init) {
        const entries = Array.from(this.functions.entries());
        const hasSource = createSourceChecker(query);
        const withSources = entries.filter(hasSource);
        const appendParsed = createParsedAppender(query);
        const doParse = (value) => withSources.reduce(appendParsed, value);
        try {
            return doParse(init);
        }
        catch (error) {
            throw new errors_1.ParseError(`query parsing failed: ${error}`);
        }
    }
    static assertParsers(maybe) {
        return maybe.map((descriptor) => {
            if (!(0, utility_1.isNullOrUndefined)(descriptor.parser)) {
                return descriptor;
            }
            const withParser = Object.assign(Object.assign({}, descriptor), { parser: (raw) => raw });
            return withParser;
        });
    }
    static assertTargets(maybe) {
        return maybe.map((descriptor) => {
            if (!(0, utility_1.isNullOrUndefined)(descriptor.target)) {
                return descriptor;
            }
            const withTarget = Object.assign(Object.assign({}, descriptor), { target: descriptor.source });
            return withTarget;
        });
    }
    static intoPairs(descriptors) {
        return descriptors.map((descriptor) => [
            descriptor.source,
            { target: descriptor.target, parser: descriptor.parser }
        ]);
    }
}
exports.QueryParser = QueryParser;
const createBooleanQueryDescriptor = (source, target) => ({
    parser: (x) => (0, utility_1.parseBoolean)((0, exports.asScalar)(x)),
    source,
    target,
});
exports.createBooleanQueryDescriptor = createBooleanQueryDescriptor;
const createIntegerQueryDescriptor = (source, target) => ({
    parser: (x) => (0, utility_1.parseInteger)((0, exports.asScalar)(x)),
    source,
    target,
});
exports.createIntegerQueryDescriptor = createIntegerQueryDescriptor;
const createPathArrayQueryDescriptor = (source, target) => ({
    parser: (x) => (0, exports.asArray)(x).map((p) => Fs.readFileSync(p)),
    source,
    target,
});
exports.createPathArrayQueryDescriptor = createPathArrayQueryDescriptor;
const createPathQueryDescriptor = (source, target) => ({
    parser: (x) => Fs.readFileSync((0, exports.asScalar)(x)),
    source,
    target,
});
exports.createPathQueryDescriptor = createPathQueryDescriptor;
const asScalar = (scalarOrArray) => {
    if (scalarOrArray instanceof Array) {
        const array = scalarOrArray;
        return array[array.length - 1];
    }
    const scalar = scalarOrArray;
    return scalar;
};
exports.asScalar = asScalar;
const asArray = (scalarOrArray) => {
    if (scalarOrArray instanceof Array) {
        const array = scalarOrArray;
        return array;
    }
    const scalar = scalarOrArray;
    return [scalar];
};
exports.asArray = asArray;
const createSourceChecker = (query) => ([source, _]) => !(0, utility_1.isNullOrUndefined)(query[source]);
const createParsedAppender = (query) => (previous, [source, { target, parser }]) => {
    const withParsed = Object.assign(Object.assign({}, previous), { [target]: parser(query[source]) });
    return withParsed;
};
//# sourceMappingURL=query_parser.js.map
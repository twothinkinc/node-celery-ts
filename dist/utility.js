"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTimerPromise = exports.createTimeoutPromise = exports.filterMapEvent = exports.promisifyEvent = exports.toCamelCase = exports.isUndefined = exports.isNull = exports.isNullOrUndefined = exports.parseBoolean = exports.parseInteger = void 0;
const errors_1 = require("./errors");
const parseInteger = (maybeInt) => {
    const [radix, toParse] = (() => {
        const toReturn = getRadix(maybeInt);
        if ((0, exports.isNullOrUndefined)(toReturn)) {
            throw new errors_1.ParseError("Celery.Utility.parseInteger: could not "
                + `parse ${maybeInt} as integer`);
        }
        return toReturn;
    })();
    const maybeParsed = Number.parseInt(toParse, radix);
    return maybeParsed;
};
exports.parseInteger = parseInteger;
const parseBoolean = (maybeBoolean) => {
    switch (maybeBoolean.toLowerCase().trim()) {
        case "true":
        case "1":
        case "on":
        case "yes": return true;
        case "false":
        case "0":
        case "off":
        case "no": return false;
    }
    throw new errors_1.ParseError("Celery.Utility.parseBoolean: could not parse "
        + `${maybeBoolean} as a boolean`);
};
exports.parseBoolean = parseBoolean;
const isNullOrUndefined = (value) => (0, exports.isNull)(value) || (0, exports.isUndefined)(value);
exports.isNullOrUndefined = isNullOrUndefined;
const isNull = (value) => value === null;
exports.isNull = isNull;
const isUndefined = (value) => typeof value === "undefined";
exports.isUndefined = isUndefined;
const toCamelCase = (toConvert) => toConvert.replace(/_([a-z])/, (_, match) => match.toUpperCase());
exports.toCamelCase = toCamelCase;
const promisifyEvent = (emitter, name) => __awaiter(void 0, void 0, void 0, function* () { return new Promise((resolve) => emitter.once(name, resolve)); });
exports.promisifyEvent = promisifyEvent;
const filterMapEvent = ({ emitter, filterMap, name }) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve) => {
        let resolved = false;
        const onEvent = (...values) => {
            if (resolved) {
                return;
            }
            const maybeMapped = filterMap(...values);
            if (!(0, exports.isNullOrUndefined)(maybeMapped)) {
                emitter.removeListener(name, onEvent);
                resolve(maybeMapped);
                resolved = true;
            }
        };
        emitter.addListener(name, onEvent);
    });
});
exports.filterMapEvent = filterMapEvent;
const createTimeoutPromise = (promise, timeout) => __awaiter(void 0, void 0, void 0, function* () {
    if ((0, exports.isNullOrUndefined)(timeout)) {
        return promise;
    }
    return Promise.race([promise, (0, exports.createTimerPromise)(timeout)]);
});
exports.createTimeoutPromise = createTimeoutPromise;
const createTimerPromise = (timeout) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((_, reject) => setTimeout(() => reject(new Error("timed out")), timeout));
});
exports.createTimerPromise = createTimerPromise;
const getRadix = (maybeNumber) => {
    const REGEX = /^(?:(0[0-7]*)|(?:0x([\da-f]+))|(?:0b([01]+))|([1-9][\d]*))$/;
    const OCTAL_INDEX = 1;
    const HEX_INDEX = 2;
    const BINARY_INDEX = 3;
    const DECIMAL_INDEX = 4;
    const trimmedLowered = maybeNumber.toLowerCase().trim();
    const maybeMatches = REGEX.exec(trimmedLowered);
    if ((0, exports.isNullOrUndefined)(maybeMatches)) {
        return undefined;
    }
    const matches = maybeMatches;
    if (!(0, exports.isNullOrUndefined)(matches[OCTAL_INDEX])) {
        return [8, matches[OCTAL_INDEX]];
    }
    else if (!(0, exports.isNullOrUndefined)(matches[HEX_INDEX])) {
        return [16, matches[HEX_INDEX]];
    }
    else if (!(0, exports.isNullOrUndefined)(matches[BINARY_INDEX])) {
        return [2, matches[BINARY_INDEX]];
    }
    return [10, matches[DECIMAL_INDEX]];
};
//# sourceMappingURL=utility.js.map
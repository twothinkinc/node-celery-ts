"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseError = exports.UnimplementedError = void 0;
class UnimplementedError extends Error {
    constructor(message) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.UnimplementedError = UnimplementedError;
class ParseError extends Error {
    constructor(message) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.ParseError = ParseError;
//# sourceMappingURL=errors.js.map
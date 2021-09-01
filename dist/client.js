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
exports.getRoundRobinStrategy = exports.Client = void 0;
const null_backend_1 = require("./null_backend");
const task_1 = require("./task");
class Client {
    constructor({ backend = new null_backend_1.NullBackend(), brokers, failoverStrategy = (0, exports.getRoundRobinStrategy)(brokers.length), id, taskDefaults = {}, }) {
        this.brokers = brokers;
        this.backend = backend;
        this.id = id;
        this.taskDefaults = taskDefaults;
        this.failoverStrategy = failoverStrategy;
    }
    createTask(name) {
        return new task_1.Task(Object.assign(Object.assign({}, this.taskDefaults), { appId: this.id, backend: this.backend, brokers: this.brokers, failoverStrategy: this.failoverStrategy, name }));
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            yield disconnectOrEndAll(this.brokers, this.backend, "disconnect");
        });
    }
    end() {
        return __awaiter(this, void 0, void 0, function* () {
            yield disconnectOrEndAll(this.brokers, this.backend, "end");
        });
    }
}
exports.Client = Client;
const getRoundRobinStrategy = (size) => {
    let index = 0;
    return (brokers) => {
        const broker = brokers[index];
        ++index;
        index %= size;
        return broker;
    };
};
exports.getRoundRobinStrategy = getRoundRobinStrategy;
const disconnectOrEndAll = (brokers, backend, toInvoke) => __awaiter(void 0, void 0, void 0, function* () {
    return Promise.all(brokers.map((b) => b[toInvoke]()).concat(backend[toInvoke]()));
});
//# sourceMappingURL=client.js.map
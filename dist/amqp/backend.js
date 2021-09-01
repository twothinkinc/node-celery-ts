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
exports.RpcBackend = void 0;
const options_1 = require("./options");
const containers_1 = require("../containers");
const errors_1 = require("../errors");
const utility_1 = require("../utility");
const AmqpLib = require("amqplib");
class RpcBackend {
    constructor(routingKey, options) {
        const DEFAULT_TIMEOUT = 86400000;
        this.options = (() => {
            if ((0, utility_1.isNullOrUndefined)(options)) {
                return options_1.DEFAULT_AMQP_OPTIONS;
            }
            return options;
        })();
        this.promises = new containers_1.PromiseMap(DEFAULT_TIMEOUT);
        this.routingKey = routingKey;
        this.connection = Promise.resolve(AmqpLib.connect(this.options));
        this.channels = new containers_1.ResourcePool(() => this.connection.then((connection) => connection.createChannel()), (channel) => Promise.resolve(channel.close()).then(() => "closed"), 2);
        this.consumer = this.channels.get();
        this.consumerTag = this.consumer.then((consumer) => this.assertQueue(consumer)
            .then(() => this.createConsumer(consumer)));
    }
    put(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const toSend = Buffer.from(JSON.stringify(message), "utf8");
            const options = RpcBackend.createPublishOptions(message);
            return this.channels.use((channel) => __awaiter(this, void 0, void 0, function* () {
                yield this.assertQueue(channel);
                return this.sendToQueue({ channel, options, toSend });
            }));
        });
    }
    get({ taskId, timeout }) {
        return __awaiter(this, void 0, void 0, function* () {
            const raw = yield this.promises.get(taskId);
            const result = RpcBackend.parseMessage(raw);
            return (0, utility_1.createTimeoutPromise)(result, timeout);
        });
    }
    delete(taskId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.promises.delete(taskId)) {
                return "deleted";
            }
            return "no result found";
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.end();
        });
    }
    end() {
        return __awaiter(this, void 0, void 0, function* () {
            const consumer = yield this.consumer;
            const consumerTag = yield this.consumerTag;
            this.promises.rejectAll(new Error("disconnecting"));
            yield consumer.cancel(consumerTag);
            this.channels.return(consumer);
            yield this.channels.destroyAll();
            const connection = yield this.connection;
            yield connection.close();
        });
    }
    uri() {
        throw new errors_1.UnimplementedError("Celery.Amqp.Backend.RpcBackend.uri");
    }
    static parseMessage(message) {
        const content = message.content.toString("utf8");
        const parsed = JSON.parse(content);
        return parsed;
    }
    static createPublishOptions(message) {
        return {
            contentEncoding: "utf-8",
            contentType: "application/json",
            correlationId: message.task_id,
            persistent: false,
            priority: 0,
        };
    }
    assertQueue(channel) {
        return __awaiter(this, void 0, void 0, function* () {
            return channel.assertQueue(this.routingKey, {
                autoDelete: false,
                durable: false,
                expires: 86400000,
            });
        });
    }
    sendToQueue({ channel, options, toSend }) {
        return __awaiter(this, void 0, void 0, function* () {
            const send = () => channel.sendToQueue(this.routingKey, toSend, options);
            while (!send()) {
                yield (0, utility_1.promisifyEvent)(channel, "drain");
            }
            return "flushed to write buffer";
        });
    }
    createConsumer(consumer) {
        return __awaiter(this, void 0, void 0, function* () {
            const reply = yield consumer.consume(this.routingKey, (message) => this.onMessage(message), { noAck: true });
            return reply.consumerTag;
        });
    }
    onMessage(maybeMessage) {
        if ((0, utility_1.isNullOrUndefined)(maybeMessage)) {
            this.promises.rejectAll(new Error("RabbitMQ cancelled consumer"));
            return;
        }
        const message = maybeMessage;
        const id = message.properties.correlationId;
        this.promises.resolve(id, message);
    }
}
exports.RpcBackend = RpcBackend;
//# sourceMappingURL=backend.js.map
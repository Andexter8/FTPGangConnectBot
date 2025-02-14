"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = __importDefault(require("debug"));
class Module {
    portal;
    name;
    description;
    stopped;
    options;
    debug;
    constructor(portal, name, description) {
        this.portal = portal;
        this.name = name;
        this.description = description;
        this.stopped = false;
        this.options = {};
        this.debug = (0, debug_1.default)(`bedrock-portal:${this.name}`);
    }
    applyOptions(options) {
        this.options = {
            ...this.options,
            ...options,
        };
    }
    async stop() {
        this.stopped = true;
    }
    async run(_portal) {
        throw Error('Module.run() must be implemented');
    }
}
exports.default = Module;

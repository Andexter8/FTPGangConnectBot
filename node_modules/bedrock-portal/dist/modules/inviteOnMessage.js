"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const xbox_message_1 = require("xbox-message");
const Module_1 = __importDefault(require("../classes/Module"));
const multipleAccounts_1 = __importDefault(require("./multipleAccounts"));
class IniteOnMessage extends Module_1.default {
    options;
    clients;
    constructor(portal) {
        super(portal, 'initeOnMessage', 'Automatically invite players to the server when they message you');
        this.options = {
            command: 'invite',
        };
        this.clients = new Map();
    }
    async run() {
        const xboxMessageHandler = async (host) => {
            const client = new xbox_message_1.XboxMessage({ authflow: host.authflow });
            this.clients.set(host.authflow.username, client);
            client.on('message', async (message) => {
                this.debug(`Received message from ${message.userId}`);
                const content = message.content;
                if (!content)
                    return;
                this.portal.emit('messageReceived', message);
                if (content.toLowerCase() === this.options.command.toLowerCase()) {
                    await this.portal.invitePlayer(message.userId);
                }
            });
            await client.connect();
        };
        const multipleAccounts = this.portal.modules.get('multipleAccounts');
        if (multipleAccounts && multipleAccounts instanceof multipleAccounts_1.default) {
            for (const account of multipleAccounts.peers.values()) {
                xboxMessageHandler(account)
                    .catch(error => this.debug(`Error: ${error.message}`, error));
            }
        }
        xboxMessageHandler(this.portal.host);
    }
    async stop() {
        super.stop();
        for (const client of this.clients.values()) {
            await client.destroy();
        }
    }
}
exports.default = IniteOnMessage;

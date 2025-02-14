"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Module_1 = __importDefault(require("../classes/Module"));
const cd = new Set();
class RedirectFromRealm extends Module_1.default {
    bedrock;
    client;
    heartbeat = null;
    options;
    constructor(portal) {
        super(portal, 'redirectFromRealm', 'Automatically invite players to the server when they join a Realm');
        this.options = {
            clientOptions: {}, // Options for the bedrock-protocol client
            overideDeviceOS: 7,
            chatCommand: {
                enabled: true,
                cooldown: 60000,
                message: 'invite',
            },
        };
        try {
            this.bedrock = require('bedrock-protocol');
        }
        catch (e) {
            console.trace('bedrock-protocol is not installed, please run "npm i bedrock-protocol" to use this module');
            process.exit(1);
        }
    }
    async run() {
        const { clientOptions } = this.options;
        const client = await this.initClient(clientOptions)
            .catch(error => ({ error }));
        if ('error' in client)
            return console.error(`Error connecting to Realm - ${client.error.message}. BedrockPortal will continue to run, but will not be able to redirect players from this realm.`);
    }
    async initClient(options) {
        return new Promise((resolve, reject) => {
            this.client = this.bedrock.createClient(options);
            if (this.options.overideDeviceOS)
                this.client.session = { deviceOS: this.options.overideDeviceOS };
            this.client.once('error', (e) => (this.client = null, reject(e)));
            this.client.once('disconnect', (e) => (this.client = null, reject(e)));
            this.client.once('spawn', () => {
                this.heartbeat = setInterval(() => {
                    this.debug(`Sending heartbeat to Realm - Status: ${this.client?.status}`);
                    if (this.client !== null || this.client.status !== 0)
                        return;
                    this.client = null;
                    if (this.heartbeat)
                        clearInterval(this.heartbeat);
                    this.debug('Attempting to reconnect to Realm');
                    return this.initClient(options).catch(err => {
                        this.debug(`Error reconnecting to Realm - ${err.message}`);
                    });
                }, 30000);
                resolve(this.client);
            });
            this.client.on('player_list', (packet) => {
                if (packet.records.type !== 'add')
                    return;
                for (const record of packet.records.records) {
                    this.portal.invitePlayer(record.xbox_user_id)
                        .catch(e => this.debug(`Failed to invite ${record.xbox_user_id} - ${e.message}`));
                }
            });
            this.client.on('text', (packet) => {
                if (!this.options.chatCommand.enabled || packet.type !== 'chat' || cd.has(packet.xuid))
                    return;
                if (packet.message.toLowerCase() !== this.options.chatCommand.message.toLowerCase())
                    return;
                cd.add(packet.xuid);
                setTimeout(() => cd.delete(packet.xuid), this.options.chatCommand.cooldown);
                this.portal.invitePlayer(packet.xuid)
                    .catch(e => this.debug(`Failed to invite ${packet.xuid} - ${e.message}`));
            });
        });
    }
    async stop() {
        super.stop();
        if (this.heartbeat)
            clearInterval(this.heartbeat);
        if (this.client) {
            this.client.disconnect();
            this.client = null;
        }
    }
}
exports.default = RedirectFromRealm;

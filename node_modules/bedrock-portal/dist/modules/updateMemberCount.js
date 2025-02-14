"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Module_1 = __importDefault(require("../classes/Module"));
class UpdateMemberCount extends Module_1.default {
    ping;
    options;
    constructor(portal) {
        super(portal, 'updateMemberCount', 'Periodically updates the member count of the session to the amount of players online');
        this.options = {
            updateInterval: 60000,
            updateMaxMemberCount: true,
        };
        try {
            this.ping = require('bedrock-protocol').ping;
        }
        catch (e) {
            console.trace('bedrock-protocol is not installed, please run "npm i bedrock-protocol" to use this module');
            process.exit(1);
        }
    }
    async run() {
        let cycle = 0;
        setInterval(async () => {
            try {
                const data = await this.ping({ host: this.portal.options.ip, port: this.portal.options.port });
                this.debug(`Updating member count to ${data.playersOnline} / ${data.playersMax}`);
                await this.portal.updateMemberCount(data.playersOnline, this.options.updateMaxMemberCount ? data.playersMax : undefined);
                this.portal.emit('memberCountUpdate', { online: Number(data.playersOnline), max: Number(data.playersMax), cycle });
            }
            catch (error) {
                this.debug(`Error updating member count - ${error.message}`, error);
            }
            cycle++;
        }, this.options.updateInterval);
    }
}
exports.default = UpdateMemberCount;

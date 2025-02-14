"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = require("timers/promises");
const Module_1 = __importDefault(require("../classes/Module"));
const Player_1 = __importDefault(require("../classes/Player"));
const multipleAccounts_1 = __importDefault(require("./multipleAccounts"));
class AutoFriendAdd extends Module_1.default {
    interval = null;
    options;
    constructor(portal) {
        super(portal, 'autoFriendAdd', 'Automatically adds followers as friends');
        this.options = {
            inviteOnAdd: false,
            conditionToMeet: () => true,
            checkInterval: 30000,
            addInterval: 2000,
            removeInterval: 2000,
        };
    }
    async run() {
        const addXboxFriend = async (host) => {
            this.debug('Checking for followers to add');
            const followers = await host.rest.getXboxFollowers()
                .catch(() => []);
            this.debug(`Found ${followers.length} follower(s)`);
            const needsAdding = followers.filter(res => !res.isFollowedByCaller && this.options.conditionToMeet(res));
            this.debug(`Adding ${needsAdding.length} account(s) [${needsAdding.map(res => res.gamertag).join(', ')}]`);
            for (const account of needsAdding) {
                await host.rest.addXboxFriend(account.xuid).catch(() => {
                    throw Error(`Failed to add ${account.gamertag}`);
                });
                if (this.options.inviteOnAdd) {
                    await this.portal.invitePlayer(account.xuid).catch(() => {
                        throw Error(`Failed to invite ${account.gamertag}`);
                    });
                }
                this.portal.emit('friendAdded', new Player_1.default(account, null));
                this.debug(`Added & invited ${account.gamertag}`);
                await (0, promises_1.setTimeout)(this.options.addInterval);
            }
            this.debug('Checking for friends to remove');
            const friends = await host.rest.getXboxFriends()
                .catch(() => []);
            this.debug(`Found ${friends.length} friend(s)`);
            const needsRemoving = friends.filter(res => !res.isFollowingCaller || !this.options.conditionToMeet(res));
            this.debug(`Removing ${needsRemoving.length} account(s) [${needsRemoving.map(res => res.gamertag).join(', ')}]`);
            for (const account of needsRemoving) {
                await host.rest.removeXboxFriend(account.xuid).catch(() => {
                    throw Error(`Failed to remove ${account.gamertag}`);
                });
                this.portal.emit('friendRemoved', new Player_1.default(account, null));
                this.debug(`Removed ${account.gamertag}`);
                await (0, promises_1.setTimeout)(this.options.removeInterval);
            }
        };
        this.interval = setInterval(() => {
            const multipleAccounts = this.portal.modules.get('multipleAccounts');
            if (multipleAccounts && multipleAccounts instanceof multipleAccounts_1.default) {
                for (const account of multipleAccounts.peers.values()) {
                    addXboxFriend(account)
                        .catch(error => this.debug(`Error: ${error.message}`, error));
                }
            }
            addXboxFriend(this.portal.host)
                .catch(error => this.debug(`Error: ${error.message}`, error));
        }, this.options.checkInterval);
    }
    async stop() {
        super.stop();
        if (this.interval) {
            clearInterval(this.interval);
        }
    }
}
exports.default = AutoFriendAdd;

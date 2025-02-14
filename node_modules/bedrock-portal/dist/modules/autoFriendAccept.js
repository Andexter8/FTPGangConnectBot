"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Module_1 = __importDefault(require("../classes/Module"));
const Player_1 = __importDefault(require("../classes/Player"));
const multipleAccounts_1 = __importDefault(require("./multipleAccounts"));
class AutoFriendAccept extends Module_1.default {
    options;
    constructor(portal) {
        super(portal, 'autoFriendAccept', 'Automatically accept friend requests');
        this.options = {
            inviteOnAdd: false,
            conditionToMeet: () => true,
        };
    }
    async run() {
        const addXboxFriend = async (host) => {
            host.rta?.on('event', async (event) => {
                if (event.data.NotificationType !== 'IncomingFriendRequestCountChanged')
                    return;
                this.debug('Received Friend RTA event', event);
                const requests = await host.rest.getFriendRequestsReceived()
                    .then(res => res.filter(this.options.conditionToMeet));
                this.debug(`Received ${requests.length} friend request(s)`);
                if (!requests.length)
                    return;
                const accept = await host.rest.acceptFriendRequests(requests.map(req => req.xuid));
                this.debug(`Accepted ${accept.updatedPeople.length} friend request(s)`);
                for (const person of requests.filter(req => accept.updatedPeople.includes(req.xuid))) {
                    this.portal.emit('friendAdded', new Player_1.default(person, null));
                    this.debug(`Accepted ${person.gamertag}`);
                    if (this.options.inviteOnAdd) {
                        await this.portal.invitePlayer(person.xuid).catch(error => this.debug(`Error: Failed to invite ${person.gamertag}`, error));
                    }
                }
            });
            await host.rta?.subscribe(`https://social.xboxlive.com/users/xuid(${host.profile?.xuid})/friends`);
        };
        const multipleAccounts = this.portal.modules.get('multipleAccounts');
        if (multipleAccounts && multipleAccounts instanceof multipleAccounts_1.default) {
            for (const account of multipleAccounts.peers.values()) {
                addXboxFriend(account)
                    .catch(error => this.debug(`Error: ${error.message}`, error));
            }
        }
        addXboxFriend(this.portal.host)
            .catch(error => this.debug(`Error: ${error.message}`, error));
    }
    async stop() {
        super.stop();
    }
}
exports.default = AutoFriendAccept;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = __importDefault(require("debug"));
const Player_1 = __importDefault(require("../classes/Player"));
const debug = (0, debug_1.default)('bedrock-portal');
exports.default = async (portal, event) => {
    if (!event.data.ncid)
        return;
    portal.emit('rtaEvent', event);
    const session = await portal.getSession();
    portal.emit('sessionUpdated', session);
    debug('Received RTA event, session has been updated', session);
    const sessionMembers = Object.values(session.members).filter(member => member.constants.system.xuid !== portal.host?.profile?.xuid);
    const xuids = sessionMembers.map(e => e.constants.system.xuid);
    const profiles = await portal.host.rest.getProfiles(xuids)
        .catch(() => []);
    const players = sessionMembers.map(sessionMember => {
        const player = profiles.find(p => p.xuid === sessionMember.constants.system.xuid);
        return new Player_1.default(player, sessionMember);
    });
    for (const player of players) {
        const xuid = 'xuid' in player.profile ? player.profile.xuid : undefined;
        if (!xuid)
            continue;
        if (!portal.players.has(xuid)) {
            portal.emit('playerJoin', player);
        }
    }
    for (const [xuid, player] of portal.players) {
        if (!players.find(p => p.profile.xuid === xuid)) {
            portal.emit('playerLeave', player);
        }
    }
    portal.players = new Map(players.map(p => [p.profile.xuid, p]));
};

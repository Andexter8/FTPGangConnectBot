"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Player {
    profile;
    session;
    constructor(profileData, sessionData) {
        this.profile = {};
        this.session = {};
        if (profileData) {
            this.profile = profileData;
        }
        if (sessionData) {
            this.session = {
                titleId: sessionData.activeTitleId,
                joinTime: sessionData.joinTime,
                index: sessionData.constants.system.index,
                connectionId: sessionData.properties.system.connection,
                subscriptionId: sessionData.properties.system.subscription?.id,
            };
        }
    }
}
exports.default = Player;

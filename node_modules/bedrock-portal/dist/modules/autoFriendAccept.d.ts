import type { BedrockPortal } from '../index';
import type { FriendRequestPerson } from '../types/peoplehub';
import Module from '../classes/Module';
export default class AutoFriendAccept extends Module {
    options: {
        /**
         * Automatically invites added friends to the game
         * @default false
         */
        inviteOnAdd: boolean;
        /**
         * If the function returns true then the request will be accepted
         * @default () => true
         * @example
         * (player) => player.gamertag === 'Steve'
        */
        conditionToMeet: (request: FriendRequestPerson) => boolean;
    };
    constructor(portal: BedrockPortal);
    run(): Promise<void>;
    stop(): Promise<void>;
}

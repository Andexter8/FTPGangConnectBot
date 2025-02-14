import type { BedrockPortal } from '../index';
import type { Person } from '../types/peoplehub';
import Module from '../classes/Module';
export default class AutoFriendAdd extends Module {
    interval: NodeJS.Timeout | null;
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
         * (request) => request.gamertag === 'Steve'
        */
        conditionToMeet: (request: Person) => boolean;
        /**
         * How often to check for friends to add/remove in milliseconds
         * @default 30000
        */
        checkInterval: number;
        /**
         * How long to wait between adding friends in milliseconds
         * @default 2000
        */
        addInterval: number;
        /**
         * How long to wait between removing friends in milliseconds
         * @default 2000
        */
        removeInterval: number;
    };
    constructor(portal: BedrockPortal);
    run(): Promise<void>;
    stop(): Promise<void>;
}

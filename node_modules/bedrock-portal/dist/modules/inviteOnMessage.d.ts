import type { BedrockPortal } from '../index';
import { XboxMessage } from 'xbox-message';
import Module from '../classes/Module';
export default class IniteOnMessage extends Module {
    options: {
        /**
         * The message to look for in chat to trigger inviting the player
         * @default 'invite'
        */
        command: string;
    };
    clients: Map<string, XboxMessage>;
    constructor(portal: BedrockPortal);
    run(): Promise<void>;
    stop(): Promise<void>;
}

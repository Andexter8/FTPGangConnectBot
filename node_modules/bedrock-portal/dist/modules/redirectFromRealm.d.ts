import type { BedrockPortal } from '..';
import Module from '../classes/Module';
export default class RedirectFromRealm extends Module {
    bedrock: any;
    client: any;
    heartbeat: NodeJS.Timeout | null;
    options: {
        /**
         * The client options to use when connecting to the Realm. These are passed directly to a [bedrock-protocol createClient](https://github.com/PrismarineJS/bedrock-protocol/blob/master/docs/API.md#becreateclientoptions--client)
         * @type {ClientOptions}
         * @default {}
         */
        clientOptions: any;
        /**
         * The device OS to use when connecting to the Realm. This is passed directly to a [bedrock-protocol createClient](https://github.com/PrismarineJS/bedrock-protocol/blob/master/docs/API.md#becreateclientoptions--client)
         * @default 7 // = Windows
        */
        overideDeviceOS: number;
        /**
         * Options for the chat command
         * @type {object}
         */
        chatCommand: {
            /**
             * Whether sending the command in chat should trigger an invite
             * @default true
            */
            enabled: boolean;
            /**
             * The message to send in chat to run the command
             * @default 'invite'
            */
            cooldown: number;
            /**
             * The cooldown between being able to send the command in chat
             * @default 60000
            */
            message: string;
        };
    };
    constructor(portal: BedrockPortal);
    run(): Promise<void>;
    initClient(options: any): Promise<any>;
    stop(): Promise<void>;
}

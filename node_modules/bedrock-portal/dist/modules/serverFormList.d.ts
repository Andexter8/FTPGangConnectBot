import { BedrockPortal } from '..';
import Module from '../classes/Module';
export default class ServerFromList extends Module {
    private n;
    options: {
        /**
         * The form to display to the player
        */
        form: {
            /**
             * The title of the form
             * @default '§l§aServer Form List'
            */
            title: string;
            /**
             * The content of the form
             * @default '§7Please select a server to join'
            */
            content: string;
            /**
             * The buttons to display to the player
            */
            buttons: {
                text: string;
                ip: string;
                port: number;
            }[];
        };
        /**
         * The time in milliseconds before the player is kicked from the session if they don't select a server
         * @default 60000
        */
        timeout: number;
        /**
         * The message to display to the player when they are kicked from the session
         * @default 'You took too long to select a server!'
        */
        timeoutMessage: string;
    };
    constructor(portal: BedrockPortal);
    run(): Promise<void>;
    private sendForm;
    private handleJoin;
    private handleFormResponse;
}

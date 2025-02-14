import type { Authflow } from 'prismarine-auth';
import type { BedrockPortal } from '../index';
import Module from '../classes/Module';
import Host from '../classes/Host';
export default class MultipleAccounts extends Module {
    options: {
        /**
         * An array of authflows from prismarine-auth, these accounts are automatically added to the host session and allows players to add them as a friend to join the game
         * @example
         * portal.use(Modules.MultipleAccounts, {
              accounts: [
                new Authflow('account1', './'),
                new Authflow('account2', './')
              ],
            })
        */
        accounts: Authflow[];
    };
    peers: Map<string, Host>;
    constructor(portal: BedrockPortal);
    run(): Promise<void>;
    stop(): Promise<void>;
}

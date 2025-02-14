import { BedrockPortal } from '..';
import Module from '../classes/Module';
export default class UpdateMemberCount extends Module {
    ping: any;
    options: {
        /**
          * How often to update the member count
          * @default 60000
        */
        updateInterval: number;
        /**
          * Whether to update the max member count
          * @default true
        */
        updateMaxMemberCount: boolean;
    };
    constructor(portal: BedrockPortal);
    run(): Promise<void>;
}

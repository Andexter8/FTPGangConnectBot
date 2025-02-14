import debugFn from 'debug';
import { BedrockPortal } from '..';
export default class Module {
    portal: BedrockPortal;
    name: string;
    description: string;
    stopped: boolean;
    options: any;
    debug: debugFn.Debugger;
    constructor(portal: BedrockPortal, name: string, description: string);
    applyOptions(options: any): void;
    stop(): Promise<void>;
    run(_portal: BedrockPortal): Promise<void>;
}

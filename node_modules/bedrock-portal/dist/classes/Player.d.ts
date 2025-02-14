import type { Person } from '../types/peoplehub';
import type { SessionMember } from '../types/sessiondirectory';
type PlayerSession = {
    titleId: string;
    joinTime: string;
    index: number;
    connectionId: string;
    subscriptionId: string;
};
export default class Player {
    profile: Partial<Person>;
    session: Partial<PlayerSession>;
    constructor(profileData: Person | null, sessionData: SessionMember | null);
}
export {};

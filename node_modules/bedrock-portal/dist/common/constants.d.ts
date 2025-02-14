export declare const SessionConfig: {
    MinecraftTitleID: string;
    MinecraftSCID: string;
    MinecraftTemplateName: string;
    MiencraftProtocolVersion: number;
};
export declare enum Joinability {
    /**
     * Only players who have been invited can join the session.
     * */
    InviteOnly = "invite_only",
    /**
     * Friends of the authenticating account can join/view the session without an invite.
     * */
    FriendsOnly = "friends_only",
    /**
     * Anyone that's a friend or friend of a friend can join/view the session without an invite.
     * @default
     * */
    FriendsOfFriends = "friends_of_friends"
}
export declare const JoinabilityConfig: {
    invite_only: {
        joinability: string;
        joinRestriction: string;
        broadcastSetting: number;
    };
    friends_only: {
        joinability: string;
        joinRestriction: string;
        broadcastSetting: number;
    };
    friends_of_friends: {
        joinability: string;
        joinRestriction: string;
        broadcastSetting: number;
    };
};

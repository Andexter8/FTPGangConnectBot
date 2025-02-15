const { BedrockPortal, Joinability, Modules } = require('bedrock-portal');
const { Authflow, Titles } = require('prismarine-auth');
const { RealmAPI } = require('prismarine-realms');

const main = async () => {
    console.log('terpyFTPConnect auth next');
    const auth = new Authflow("terpyFTPConnect", './', { authTitle: Titles.MinecraftNintendoSwitch, deviceType: 'Nintendo', flow: 'live' });

    const portal = new BedrockPortal(auth, {
        // The server IP & port to redirect players to
        ip: 'ftp-gang.mc.gg',
        port: 19132,

        // The joinability of the session. Joinability.FriendsOfFriends, Joinability.FriendsOnly, Joinability.InviteOnly
        joinability: Joinability.FriendsOfFriends,
        world: {
            hostName: "terpyFTPConnect",
            maxMemberCount: 40,
            version: "1.21.60",
            name: "§bFTP §8Gang §cServer Connect",
            memberCount: 5,
        }
    });

    await portal.start();
    let checkRun = 0n;
    /**
     * @type {{id: string, checkRun: bigint}[]}
     */
    let recentJoiners = [];
    portal.on("playerJoin", p=>{
      if(!recentJoiners.includes(p.profile.xuid)){
        recentJoiners.push({id: p.profile.xuid, checkRun});
      }
      // Debugging
      console.log(`${p.profile.displayName} (${p.profile.gamertag}) <${p.profile.xuid}> just joined.`);
    });
    console.log('terpyFTP auth next');
    const terpyAuth = new Authflow('terpyFTP', './', { authTitle: Titles.MinecraftNintendoSwitch, deviceType: 'Nintendo', flow: 'live' });
    const callbackForInvitingPeopleOnRealm = (async ()=>{
      checkRun++;
      try{
        const players = (await RealmAPI.from(terpyAuth, 'bedrock').getRealm("21577514")).players.filter(p=>p.online === true);
        players.forEach(async p=>{
          try{
            if(recentJoiners.findIndex(v=>v.id === p.uuid) !== -1){
              recentJoiners.splice(recentJoiners.findIndex(v=>v.id === p.uuid), 1);
              return;
            }
            const pxbl = await portal.host.rest.getProfile(p.uuid);
            if(pxbl.isFollowedByCaller){
              // Debugging
              console.log(`Already friended ${pxbl.displayName} (${pxbl.gamertag}).`)
            }else{
              try{
                await portal.host.rest.addXboxFriend(p.uuid);
              }catch(e){
                console.error(e, e.stack);
              }
              // Debugging
              console.log(`Successfully friended ${pxbl.displayName} (${pxbl.gamertag}).`)
            }
            await portal.invitePlayer(p.uuid);
            // Debugging
            console.log(`Successfully invited ${pxbl.displayName} (${pxbl.gamertag}).`)
          }catch(e){
            console.error(e, e.stack);
          }
        });
      }catch(e){
        console.error(e, e.stack);
      }
      recentJoiners = recentJoiners.filter(j=>j.checkRun>=checkRun);
    });
    setInterval(callbackForInvitingPeopleOnRealm, 15000);
    callbackForInvitingPeopleOnRealm();

};

main();
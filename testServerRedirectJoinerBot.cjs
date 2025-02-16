const { BedrockPortal, Joinability, Modules } = require('bedrock-portal');
const { Authflow, Titles } = require('prismarine-auth');
const { RealmAPI } = require('prismarine-realms');
// const botCredentials = require("./bot_credentials.json");
const fs = require('fs')

class FileCacheB {
  constructor (cacheLocation) {
    this.cacheLocation = cacheLocation
  }

  async reset () {
    const cached = {}
    fs.writeFileSync(this.cacheLocation, JSON.stringify(cached))
    return cached
  }

  async loadInitialValue () {
    try {
      return JSON.parse(fs.readFileSync(this.cacheLocation, 'utf8'))
    } catch (e) {
      return this.reset()
    }
  }

  async getCached () {
    if (this.cache === undefined) {
      this.cache = await this.loadInitialValue()
    }

    return this.cache
  }

  async setCached (cached) {
    this.cache = cached
    fs.writeFileSync(this.cacheLocation, JSON.stringify(this.cache))
  }

  async setCachedPartial (cached) {
    await this.setCached({
      ...this.cache,
      ...cached
    })
  }
}

const main = async () => {
    console.log('terpyFTPConnect auth next');
    const auth = new Authflow("terpyFTPConnect"/* botCredentials.email */, './', { authTitle: Titles.MinecraftNintendoSwitch, deviceType: 'Nintendo', flow: 'live'/* , password: botCredentials.password */ });
    // await api.getRealms().then(console.log);

    const portal = new BedrockPortal(auth, {
        // The server IP & port to redirect players to
        ip: '85.190.131.3',
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
    }); /* 
    portal.use(Modules.RedirectFromRealm, {
        // The client options to use when connecting to the Realm.
        clientOptions: {
          realms: {
            pickRealm: (realms) => realms.find(r=>r.name.includes("FTP")) // Function which recieves an array of joined/owned Realms and must return a single Realm. Can be async
          }
        },
        // Options for the chat command
        chatCommand: {
          // Whether sending the command in chat should trigger an invite (optional - defaults to true)
          enabled: true,
          // The message to send in chat to run the command (optional - defaults to 'invite')
          message: 'invite',
          // The cooldown between being able to send the command in chat (optional - defaults to 60000ms)
          cooldown: 6000,
        }
      });  *//* 
    portal.use(Modules.AutoFriendAdd, {
        // When a friend is added, automatically invite them to the game
        inviteOnAdd: true,
        // Only add friends that are online and remove friends that are offline
        conditionToMeet: (player) => player.isFollowingCaller,
        // How often to check for friends to add/remove (optional - defaults to 30000ms)
        checkInterval: 30000,
        // How long to wait between adding friends (optional - defaults to 2000ms)
        addInterval: 2000,
        // How long to wait between removing friends (optional - defaults to 2000ms)
        removeInterval: 2000,
    }); */

    // (await portal.host.rest.getProfile()).presenceState = "Online";
    // console.log((await portal.host.rest.getInboxMessages("primary")).conversations);
    // console.log((await portal.host.rest.getInboxMessages("secondary")).conversations);
    // setInterval(async () => {
    //     const a = (await portal.host.rest.getInboxMessages("secondary"));
    //     a.conversations.filter(c=>!c.isRead).forEach(c => {portal.invitePlayer(c.lastMessage.sender); c.isRead = true;});

    //     console.log((await portal.host.rest.getInboxMessages("secondary")).conversations);
    // }, 10000)

    // console.log((await portal.host.rest.getInboxMessages("secondary")).conversations);


    // accepts a player's gamertag or xuid
    //   await portal.invitePlayer('Andexter8')
    // await portal.host.connect();
    console.log('terpyFTP auth next');
    // await portal.host.rest.removeXboxFriend((await portal.host.rest.getProfile("Andexter8")).xuid);
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
    // console.log(await portal.host.rest.get("https://frontend.realms.minecraft-services.net/api/v1.0/worlds/21577514/stories/playeractivity"))
    // await portal.host.rest.addXboxFriend((await portal.host.rest.getProfile("magikjames1890")).xuid);
    // await portal.invitePlayer('magikjames1890');

};

main();
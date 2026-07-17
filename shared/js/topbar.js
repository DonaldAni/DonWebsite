class Social {
    constructor(img, link) {
        this.img = img
        this.link = link
    }
}

// social links
let toadd = [
    new Social("home", "/home"),
    new Social("twitter", "https://x.com/DonaldAni1010"),
    new Social("youtube", "https://www.youtube.com/@donaldani10/videos"),
    new Social("roblox", "https://www.roblox.com/users/349593445/profile"),
    new Social("comms", "/comms"),
    new Social("dni", "/dni"),
    new Social("games", "/games/runner"),
    new Social("ask", "/questions"),
    new Social("chat", "/chatroom")
]

// marquee texts
// could hide secret strings in here
let canpick = [
    "the bugs are back",
    "the glunch just grew legs im.. im terrified dude.",
    "my girl bought me my first car, damn man im selling that immediately",
    "high spirits, high power",
    "dancing, walking rearranging furniture! kayla's, shopping, i let the mike out of his cage!",
    "shoutout the hemmylings",
    "shoutout the sunglasses team",
    "shoutout the <a href=\"/home\">artist</a> of this website",
    "i hope i remember to pay for this site",
    "i also own donaldani.com, i just cant use it",
    "im 0-22 in wrestling, JV warrior???",
    "sniper is the worst class, you should die if you main him #truthnuke",
    "is 3'2'' 400lbs good? im trying to cut down to 6'9'' 125 lbs.",
    "check out <a href=\"https://hexose.cc\">hexose.cc</a>",
    "paint please, the glunch is escaping.",
    "THE BUGS ARE STILL HERE",
    "you ain't seen ten bands in your life, jit.",
    "tied the ops to the back of a trackhawk and dragged 'em around the block for 24-hours.",
    "i am to be respected!!!!!!!!!!!",
    "im smoking on dinkelberg.",
    "ops wanted some initiative, blew up their entire quadrant i'm movin' like oppenheimer.",
    "she dropped that booty on me from an egregarious angle.",
    '<img src="/shared/img/topbar/telemove.gif" style="height: 8vh"><img src="/shared/img/topbar/telemove.gif" style="height: 8vh" width="150"><img src="/shared/img/topbar/telemove.gif" style="height: 8vh"><img src="/shared/img/topbar/telemove.gif" style="height: 8vh">',
    '<img src="/shared/img/topbar/Snowy_Egret.png" style="height: 8vh">',
    '<img src="/shared/img/topbar/gamemakererror.png" style="height: 8vh">',
    '<img src="/shared/img/topbar/malcom.png" style="height: 8vh" width="250">',
    '<img src="/shared/img/topbar/adobeanimate.png" style="height: 8vh">',
    '<span style="color: rgb(219, 21, 21)">cass</span> ill kill you, you you YOU.',
    '<span style="color: rgb(219, 21, 21)">dont put alyanna in the secrets tab.</span>',
    'happy new year <span style="color: rgb(255, 227, 190)">2002!</span>',

    // ones i added
    "fart mode: TRUE",
    "poop mode: ON",
    "<a target=\'_blank\' href=\'https://phil.kayladotcom.org/getfile/sapsucker%20rays\'>click me</a>",
    '<span style="color: rgb(255, 91, 159)">i have hacked donald\'s website. do not resist me. -kayla</span>',
    '<span style="color: rgb(255, 91, 159)">' +
        "okay, look. it's me again. listen, i got into some pretty hot water here. long story short, do you have $200,000 dollars that i can borrow? -kayla" +
        '</span>',
    ":-)",
    "downloading virus...",
    "you are 1,000,000th visitor! <a target=\'_blank\' href=\'https://phil.kayladotcom.org/getfile/sapsucker%20rays\'>click here for prize!</a>",
    '<img src="https://phil.kayladotcom.org/getfile/youll never unsee" style="height: 8vh" width="200">',
    '<img src="/shared/img/topbar/medic.png" style="height: 8vh" width="400">',
    '<img src="/shared/img/topbar/smoke.png" style="height: 8vh">',
    
    
    
    
    
    
    'ţ̸̡̡̨̨̨̨̨̢̡̧̢̢͚̱̥̟͍̝̙͉͚͎͕͙͈̺̹̘̗̯̜̝̤̰̥̱̗͓̻͙͓̹͔͖͕̭͍̬͕̥̫͎̹̱͓̠͔̭̳͚̩̗̯̞̠͇̰̗̺̻̪̤̳̤͍̩͎̯̻͙͓̤̖̫͙͓̦͉̹̯̩̪̲̯̭̬̭̪̬̞̘̯̠̼̪̭͉̭̰̝̠͚͖̖̼͔̰̖͕̳̯̲̄̅͆̾̇́͆̑͌͒̎̚͜͜ͅͅͅh̶̛̜̳̺̝͙̹͌̌͊̉͊̈́̏̉̈́͐̽̅̀̀̓̎͆̔̓̆̀̒̓͂̆͐̌́̈́͊̈̏͂̑͋̽̂̈́̈́̆͊͆̐̾̿̈́́̚͘͘͝͠͝ḭ̶̡̢̢͕͚̳͓̫̤͖̝̻̗͔͈̠͎̣̘̯̳͇̙̘͔͓̻̞̜̭̰͔̍̌̂̈́̀̍̒̀̈̓́̀̇̾̔̈̽́͒͋́́͒̒̽̑́́̃͋̒̾̀͐̉̐̂̑͐̑̌̾͂̅̉̍̀̔̅͗̄͋͑́̉̂̀̓̅̈́̐͐̐̃͋͑͆͌̐́̈́̂̂̄̓̀̒̏̓͊̌͐͐̐͌̒͛͛̎̓͒̊̃̽̍̚̚̕͜͝͠͝ş̷̧̨̧̨̡̡̨̛̛̛̛͈͔̬̦̣͍̰̮̯̳̹̺̭̩̲͚̣̪̦̥͙̺͉͍̤̜͍̣̻͉̫̟̻̪̟̦̱͎̝̭͖͈̹̯̘̼̬̖̝̫͍̩̗̣̻͚̩͉̘̞̩̰͑̆̉̆͐͂̒̄͑̑̎̓͊͒̆̈́͊͌͗̉́̇̆́͆́̽̉̓͋͛̀͑̽̓̍́̽̍͌̆̾͂̈́̆̾̾̀̀̒̓͆̐̑̀̆͊́͋͒̏̓̚͘͘̚͜͝͠͠͝͝͠͝͠͠͠ ̷̢̨̡̨̡̢̡̨̛̥̮̩͖̥̱͎̖͙͓̹̹͙̖̗̯͖̲͇͕͉̫̪̩͇̜͖̞̻̤̱̜͕͎͖̤̹̬̝̘̟̠̖̱̰̠̝̭̥̺̦̹͉͖͍̱͚͕̥͙̠̯̹̯̤̺̘͔͇̗̰̯̣̭͎̜͖̰̭͇̟̞̪͖̞͔̣͚̝̜̖͎̳̠̼͚̜͚̈̑̒͌̈́̒̔̈̊̂̀̿̋̓̇́͛̐́̈́̈̔̄̿̉̆̆̔̓͋͌̑̽̏̄͛̿̎̆͑̏̆͐̀̃̽̀̈́͌̓̆̾̅̉̀̃̌̋̐͑̄̊̒̈̀̃̃̃́̏̃̑̑̔̈́̓̉̈͂͑̈́̏̀̍̃̍̐̇̈͌̃̈́̈́̂̂̐̓͋͂́̏̒͋̕̚͘̚̚̕͘̚͜͜͜͜͝͝͝͝͝͝ͅí̸̢̢̡̡̛̛̛͓̟͍̫̩̞͎͖̝̖͉̹̙̩̥̖̺̫̙̦͙̫͖̲̫̝͉̫̹̤̥͍̹̭̅͂̒̊͛̇̄̉́̍̇̓͑̿͆̀͊͐͗̒̊̿̆̈́̾͋̍̄̓͋̃̔͛͂̉̄͂́̋̌̋͋͒̓͊̓̈́̓̂̓̏̈́̍͊̆̓̐͊̓͆̽͌͘͘̚̚̕͜͜͜͠͝͝ͅͅş̸̢̨̨̛̛̯̮͇͇͙̫͚͚̠̦͚͈͍͓̯͙͙̳̮̤̮̟͈̣̺̈́̐̀̋̈́͒̋̈́̔͆̈́́̄̔̃̄̃̎̂̊́̕̚͠͝ͅ ̵̢̨̢̡̢̡̫̬̼̖͔͎̯̜̠͉̭͕̞͇͔̪̭͓͇͕̹̙̘̦͓͖̘͔̥̲͕͍̪̟̠̺̻͔̥̙͖̝̞͇̖̦̖͉̬͈̰̙̻̺̞͚͍̮͙̲̜͌̆͌̔̈́̂̇̿̍̆̏̿͑̀̆̔̎͐͑͆̓̈́̍̏̓̄͂̉͒̀͐̾̔̔̀̋̾̓̒͆͌̄̋̈́̈͋̄̀͒͛̾̉̀̓̾͒͑͂̏̆́̇́͛̒͑̉̿̇̽̌͆̌̈́̀̐̈́̃̈́̕̚͜͝͝͠͠͝͝͠ͅḿ̸̧̨̧̡̢̨̡̨̢̧̢̛̛̛̛̛̛̺̣̱̣̦̹̜̼̝͍̺̤̬̖̰̠̝̫̥̝̞͈̟̺̺̠̺̮̠͎̹͙̠͎͙̱̬͕̗̺͕̯̲̺̟͙͕̥̗̯̤̰̥̬͇̮̞̳͓̪͕̫̹͔̮̳͓̮̙͓̗͓̝̞̟̰̹͔̜͔̱͈̤̪̝̖̱̄̍̀̀́̓͊̔̽̀̉̏̂̊͊̒͛̋̓̆̾̈́̾̈́̄̿̑̀͊͊͌̌͐̓̎̒̔͂̈́̈́̆̀̔͑̈́̒̉̈̈̇̾̍́̂̒̂̈́̽͋̈̊̏͂̎̈́̂͌̍͛̿͊̔̀̉̎̒́̊̓̀͌͛̓̿́̀̅͆̾̚̚͘̕̚͘͜͠͝͠͠͠͝͝͝͝͝͝͠͝ͅỳ̷̡̨̨̨̢̛̛̻̣̭̘̱̲̙̺͖͓̖̫͙͓͓̲̞̩̜̦̖̭̩̭̟͚͈̮͔̱͚̞̝̝̤̰̙̲̻͕̪͉̪̻͇̟̺̪̻͕͎̻̝̫̰̥̲͖̺͉͈̳̟͇̻̬͉͔͙̰̰͎̞͍̜̬̩̽̀͂͐̊̈́̿̒͂̎̂̌͐̌̎̓͑͊͂̓̃͊̑̓̓͊̋̌̊̍͒̀̏̉̾̈̈́́͌̏́̌͆̎͗̆̏̄͌̅͑͂̔͑̈́͌̿͋͐̉̂͆̒͐̌̅̋͛̿̕̚̕̕̚̚̕͜͝͝͠͠͠͝͠͠͝ ̸̧̢̡̢̢̨̧̨̺̦̥͙͎͖̠͇̗̫̲̣̖̫̜̪̲̲͓̤̼̬̲͎̲̰͎̪͚͙̥͉̟̼̙͕̞̞̩͉̣̯̣͎͉̍̾̾͋̑̋̈́̈̀̓̊͂̈́̔̉̆́̈́̈́͌̏̽͆̍̋̄̿̿̎̏͌̕̚͘͠͠͠ͅͅs̷̢̢̝̬̙͎̫͎̖̤̿̓̎̿̄̆̾̂̀́̀̓̄͘͠͝ͅc̶̛̛̛͇̝͈͕̋͒͆̀͑̀͐̏̑͗͑̆̓̈̓̉͋͆̀̂̒̾͊̿̆̆̈̌͐̃̾̌͆̉͂̔̎̔̀̊̏̈́̀͋̈́̋̿͊͐̈̃̓̈́͗̇́̉̂̉́̄̿̀̈́̿̅͒̿̆̈́̄̃̀̍̽̃͐̓̀̀̔̋̈̀̏͑̊͑̈͛́̔̐̾͊͐̾̄̐̑̚͘̕̚̕̚͝͝͝͝͠͝ȃ̸̡̢̛̰̲͈͉͙̠̬͎̻͙̬̌̓̅́͋͒̿͋̌̎̆̅̾̀̏̎̌̃͂̂̓͛̽͛̂̃̓̊̇̂͛̄̃̆̓͗̈́̽͒̉͂̋́̀̋̿̇̑́̇̆͗̉̃̌͘̚̕̚͠͝͝͝͝ȑ̴̨̢̡̖̰̪͈̳̼̼͉̹̮̥̖̬̣̝͉͎͓͎̱̻̖̫͓̬̮̼̰̞͍̹̯̯̤͍̤̞̖̯̼͎̠̼͓͖͙̯͈̩͈̟̻̠̫͚̝͙̯̠̯̱͚̹̘̹̭̞̠̘͎̺̲̳̩͇͓͙̔̓̄͆̄͛͗́̓̄͆̃̑͘͜͜͠͠ͅͅͅͅͅͅͅͅͅŷ̵̧̧̨̡̢̢̨̧̡̦̼͓͎͎͇̩̠̠̥͎͈͍̹̭̪͉̭̳͉̜̖̭̙̯͙̦̣̳̫̠̜̲͙̟͈̜͕͈̟͈̺̜̩̰̻͍̰̺̗̲̱̫̼̥̥̱͉̱̤̙͇̠̝̞͖̗̤̱̙̼̻̬̭̹̻̭̼̣̩͕̮̹̬̭̫͈̻͇̜̫͈̦͚̳̠̟̩͔̠̣̖͕̩̊̀̈́̏̉̇̎̈́̎̈́̐̔̄͆̀͑̈́̎̾͒̀̒͊̅̀̅͂́̈͑́̑́͋̂͗̇̔̍͐̂̉̌́̅́͂̓̅̒̽̈́̒̂͂̈̄̂̈́̈́̋̆̉́́̇̽͐̓͐̕̕̕̕͘͘͜͜͜͜͝͝͝͝͝͝͝ͅͅͅͅͅ ̵̧̨̢̨̝͎̗̺͕̖̻̳̱̦̩̰͍̟̬͙̗̰̠͉͚͚͖̮͔̤̞̳̰̯̭̦̲̭̳̱̤̅͑̒̇̀̀͒̎͗̎̆̋̈́͐͜͠ͅt̶̨̢̨̧̧̡̛̛̪͖̱̱̠̬̬̺͈̱̹̩̮͕̮͕̻̫̗̙͍̝̺̳̦̮̪̘̱͚̣̪̰̠͍̠̣͓̑̏̄̋̇̎͌͗́̏̾͗̀̂͗͌͒̑̈̊̒̈́̊̔̌͗̋̆̊̽̍̅̏̑͗̂͊͆́̂͌̂́̊̀̓̆̓̆̒͌͑́͆̉́́̋̊͗͊͊̒͂̽̎͂̈́́̂̌̈́͑͒̈́̏͘͘̕̕̚͘͜͝͝͠͠͠͝͝ͅͅę̵̨̡̡̢̮͍̭̳̳̟̙̝̤̭̪̹̝̣̜̹̭̫̗͉̻̬͇̦̟̪͕̳̤̺̗̲̻̙̪͑͊̇̉͊̊͛̌͌́̀͊͋̐̕̕̚ͅͅx̸̧̡̡̡̢̹̩̞͍͕̲̤̟̣͖̗̞̖̭̙͇͕̰̝̰̰̤̬͈̺͔̤̫͈̞̲̞̮̼̥̜̮̣̤̝̠̯̖̮̖̝̯̳̝̠̫͎͚̘̫͙̟͑͋̎͒͑͐͂͜͜͜͜͜ţ̸̡̧̡̧̧̡̨̡̛̙̠̲̠̹̺͚̙̙̲̼̦̲͙͉͎͚̺̰̣̮̹͎͓̖̤̫̙͕̻̗͚̹̪̺̤̞̖̖͍̝̣͖̜̘̬̫̳̣͔̦͚͚̰͙͔͇̝͇̗̹̥͈̤̣͎͙̗̮̹̬̦͎̦̮̟͖̟̜̳̩̻͍͉͙̰̜̰͓̗̱̫̪̝͕͕̰̲͔̥̦̙̺̟̜̹̲̦̲̺̽̋̓͒̃͛́̆͗̊̀̌̒́̓͆̄͛́͊̿̌̾͐̿̐̃̍̆̈̈͗̒̆͒̅̈̍̓̓͂͗͒̂̃͌̊̅͌̅̒̑͛̾̆͑̓̉͌͌͛͋͊̉̋͌̊̃͊͐̾̐̄̉̈́͆̐̎̓̉̎̈́̈́͊̍̒̕͘̚̚̚̕̚͜͝͝͝͝͝͠͝ͅͅ ̵̡̨̢̧̨̢̢̧̧̧̧̛̛̮͉͍͙͔̜̜̗͚̼̩̩̼̖͓͚̪̻̣͖͙͉͎̪͍̖̫̙͍͇̼̪͔͚̻̪̭̥̬͕̤̳̯͕͙̟̠͚͈̜̜̜̪̻̭̮͓͖̠̜̟̗͍͙̭̳͍̮͕͇̬͚̟͇̣͔̘̰̳͚̰̭̱̱͍̬̗̹̮͎̘̉͐̂̃̊͐̅̅̅̂̃̅̿̇͂͂͐̈́̀͒̃̇͛́̀́̂͛̿̇͐͒̒̍͗͛̈́͐̾͌͐̔̇́̓̒́͂͊̄͒͋̾͆̊̆̆̊̇̌͆́̒͗̋̆̋̈́͆̅̿̉̕̕͘̕͘͜͜͜͝͝͝͠͠͝͝͝ͅͅǎ̶̡̡̡̨̨̢̧̡̨̨̨̧̡̧̢̨̨̢̛̛̺͎̳͙̥͎͓̭̪̬̹̖̳͖͓͇͍̩̹͈̩̝̦̰̼̻̱͇̰̲̹̰̙̱̺̤̭̪̺̯͙͍͕̦̜͓͇̣̖͙̖̞̳͈͈͕̞͉͔̜͉͍͙̯̩̪̮͈̼̞̣͚̙̻͕̰̟͕̗̬̫̞͍̭̬̮̥̥͈̱͖̩̣̖͖̭̟͍̺̘͊̿͑͛͑̌̉͋̅̓̂̄͊̈́̀̀̆͛́̈̆͆́̇̂̊͂͌̽́͑̄̃̈̄̑͊̊̂͗̾̈́̅̑̒̾̀̄̋̾̉͂̽̇͊̍̓̇̓̃̕̚̚̚̚̕̕͜͜͝͝͝͝͝ͅḩ̶̨̛̞̝̜̥̖͚̼̱͙͕̬͕͓͚̦̼͚͖̣̭̥̯̞̈́̌̑̓̉̓̔̃̂͊͒́̑̌̀̃̑̓̒̉̑̔͛̇͘̕͘͘͜͝͠͠ĥ̶̢̨̢̨̢̧͙̜̹͎̮̜̻͈̰̻̩͓̙͖̠̰̯͖̻̯̙͚̻̭̖̝̤̤̙̞̹̣͖̠̫̖̠͓̳̰̭̬̺͈̳̗̱̬̱̟̬͚̬̩̺͍̜͓͔͎̞͕̠̆̀̋̌̈́͐̍͗͑̀͒̀̀̈́͋̎̅̄̆̓́̄̍͐͛͊̐͐̌͐̇͋̒̃̄̃̔̌͊̚̚̕͜͜͝͝͠͝ȟ̶̢̡̧̢̢̛̩̙̪̺͇̲̯̰̖̬̬̯̩̗͇͍͓͈͔̜͓̪̺̣̰͈̣͙̟͚̣̺̝̫̠̤̞̻̺͉̯͖͓͍͔̣̭͇̪̟̗̩̣̩͇͇̱͖̮͔̗͙̥̗͔̗̤̬̱͖̪̪̺̻̭̯̩̰̦͉̲̙͈̝̝̥̦͓̼̣̟̝̘̥̠̹̠͑́̀̌̾͐͋͊͆̋̀̆̋̍́̽͋́̉͋̒̒͋̓̈́̈́͛͑̅͗̓̋͛̂̏̈͂̉̓̏̌̾̋̄̋̊̈̓̊͂͗͛̋͌̉̽͑̒̄͊̏̔͑̿̽̌̃̔̍̉̉́̎̾̒͛́̾̈̑́̐́̈́̈́̋͗̃̒̏̇͒̑̌̊̒̃̀͒͆͒͐͊̀̌͒̀̋̓͂̈̀̈́͘̕̕̚͘̕̚͘͜͜͝͝͝͝͝͠͠͝͝ͅͅḣ̶̡̧̨̢̡̡̨̧̨̛̛̛̛̛̛͖̱̗͚͖̩͙̩̞̮̙̦͉̩͉̙̥̱̹̞̻̞̗͚̫͕̯̖͕̳͈̜̗̳͎̟͇̦̹͖͈̝̥̪͕̩̘̙̹̦̼͎̲̘̱̟̣̻̝̩͕̺̲͚͓̹̞̦̩̲̩͙̠̩̫̪̫̣̜̼̘͈̘̰̞̺̪̪̻̗̗̽͒̃͊̋͛̎̀̃̓͒̅̔́̈́́̅̐̔̋́̍̈́̏̀̒̿́̈̄̂́͆͂͌͋͊͌͛̉̆̽̑̐͋̋̐̍̃̅̽̏̄̀̑͛̿̏̈́̎̄̏̾͆̑̌́̈͒̃̿̄̿̀͛̎̊͋͑̂̈́̈́͛͛͋̋̉͐̀̔̃͆̏́̿͋́̃̽́̉́͘̕̕͘̕̚̚̕͘͜͜͠͝͝͝͝͠͝͠͝͝͝ͅh̵̢̡̨̨̨̧̢̧̧̡̧̛̟̪͓̪̤͇̟͕̞͔̺̳̥̖̘̻̤̝̺̫̪̹͙̙͚̺̳̩̮̗̤̱͚͕̜͎̰̞̼͕͎̱̩͕̜͍͇̰̜̞͍̠͚̜̘͎̘̪̟͉̞̙̞̦̰̭̩̦̞͍͙͇͇̖͓̤̝̗̱̞͙̖̹̙̳͈̘̭̣͔̠͍̫̣͓̻̲̘͉͓̤͓̠̮̻͚͔̊̇̌̒͋̄̅̿͋͌͋̑́͗̊̀̈́̀͋̍̾̉̈́̋̀̅̀͋̎̋̾̉̓́̈́͗͐͋̚̚͜͝͝ͅͅͅḩ̸̢̝̜͈͈̖͙̟̝̲͈͚̪̥͈̙̬̮̰͔̱̮̪͙̉͗́̓̆͑̌̌̃̔̎̌̀̓́͊̔̅̄̌̾̾̍̓̓̑̄̅̌̊͐̂̚͜͜͜͠͝͝h̴̢̨̨̢̧̨̨̢̨̧̧̨̧͍̲͇̮̻͙̜͉̫̪̖̟͖͈̳̼̜͈̼͕̲̜̙̭̯̱̠̲͇̤̻̹͙͇̻͍̘̺̖̮͍̝̟̘͓͇̠͔̮̥̻̗͚̲͚̦̝̻̻̳͉̼̩͙̘̺̰̣̻͎̠̼̯̫̰̗̩̰̳̮͔̱͙̜̖͇͔͇̜̲̜̜̘͓̻͈͎̺̹̦̪̩͖͓̠̼̺̻̲̫͇̘̬̬̖̓̍ͅḫ̴̨̛̛̛̛̹̝͕̮͉̗̺̦͙̮̦̺̮͚͍͇̣̭̤̺̯̯̺̬̮̗̹̻̬̰͓̗͖͇̮̰̬̦̪̜͎͉̭̱̹͙̠̝̥͎̦̥̺͕̳̠̭͇̔͑̉̈̌̈́̑̂̌͂͑̄́̀̓̌͛̍͋̀͂̀̉̓̾͋͒̅̀͌͂̂̀̃͗͆̓͛̇̽͐͐̄̍͗̌̑̈́̏̾̈́͐̈̄̉́͑̊̋͂͒̈́̎̓͑̑́̔̀͛̉́̆͋̾͐͊́͑̎̂̽̚̚̚͘͘̚̚͜͠͠͝͠͠͝͠͠͝͝ͅh̴̢̡̨̢̨̨̡̛̛̛̛̗̖͚̫̰̺̬͚͇͖̻͉̻͍̰̲͓̼̬̝̬̻̲̝̰͖͕̯̜͙͖̙̺̖̫̫̺̬̻͔̥̩̜̮̺͚̟̭͓̬̲̳̪͓̫̭̼̏̈́̈̃̑̇̅͊́͑̏̐͒̓͗͛̍̀͌́̏̔̆̑̊͐̽̌͋͋͂̋́̿͊̓͗͂̽̏͗̓̓͌̔̉͌͌̾͑̋̽̇̐̔̀͒͒̾̔̐̈͛̌̀̂͐̽̀̽͂̃̆̈́̋̒̈́̐̆͐̉͋̌͘͘̕̚͜͝͝͝͝͝͝͝͝͝͝h̶̨̡̧̧̧̨̨̡̧̛̛̛͖̞̱̘̭̜̰̞̘̩̝̣̰̭͉͙̪̝͔̼̮͓̥͓̪̣̝̞̹̹͇̟̲̩̻̯̖͕̫̳̺̘͕͚̠̮̹̮̗̹͇̻͓̣͖̘̮̩̞̙̝̭͍͎̳͈͇̫̞̀̏͌̀̌̽̄̀̃̋͒́̾͗͊̋̃̈́͗̌̋͂͑͒̓͊̈́̇̀͂̈́͂͆̄̈́̆͑̋̈̒̃͆̀͒͂̽̊̓̒̈́̿̋̈́́͒̓͑̒̐͛̀̄͑̓̅͂͛́̒̈́̇̈͌̌͋͋̑̅̏̽̚̚͜͝͠͝͝͝ͅͅh̸̡̡̢̡̡̧̛̗̬̣̤͓̹̻͚͕̭̺͓̳̟͚̭͖̼̩̳̼̹̳͈̳̼͕͎̘̙͙̞͉̟̠͖̻̮̖̼͔̗͉̩͈̱̠̥̱̲͎͚̲͉̣͖͙̜̤̩͖̝̥̑͆̒̀͌͒̔̌͊͊̌̕̕͜h̴̡̨̢̧̢̢̧̨̤̮̼͕͖̜̼̙̼̼̜̯͚͙̮̩͈̗̟̮͙͙̹̘̥͖͙͕̰͓̹̻̯̭̘͉̺̻̤̘͈̹̺̥̣͍̝̹̯̦͚̱̯̝̻͉̝̦̜͈̪̟̥̮̗̠͙̦̥̉͗̈̎͗́̋̀̅́̓̂̍̉̒̈́̄͊̂̾̇͒̈́͛̓̋͂́̈͆̅̌̋̓͐̍̓͑͊͗͑̊̊̎̈́̎̓͊̍̓͑͂̒̄̎̓̓̓̑͑͑̅̈͆̀̑́̽͆̆̈́͑̈̓̐̄͘͘̕͜͝͠͠͝͝h̷̢̧̨̡̢̡̢͎̭̮͓̠̤̮̜̭͍̯͔͍̖̠͚̬͎̻̥̟̖̞͉͇̟̦̠̙͕̣̼̜̤͓͎̠̹͉͉̟̻͕̻̘̯̲̻̖̪̣̼̝͎̩͚͍̠̪̦͍͓̩̫̰̖̙͎͔̗̗̼̗̙̫̺̺̺͇͎͎̲͊̑̎̆͛͜͜͝ͅͅh̷̨̡̡̢̡̧̧̧̧͖̱̫̫̰̺͖̫͔͎̭̜̰̖̤̞̗̘̝̩̜͖̮̲̱̣͓̘̠̭̹͕͉̞̗̪̼̮̹̦̯̥̩̼̟̝̲͉̲͔̹̺̜̯̖̠̖͚̤̰̬͈͚̼͔̞͎̼͇̬̘͖̩̜͓́͜͠ͅh̴̡̨̢̨̧̛͙͉̯̩͉̳̞͍̖͓̫̟̺̦̙̥̭̦̬̦͕̙͎̫͈̯̝͍̙̬̟͎̯̮͇̺̳͇̩̬̥͎̱̝̭̜̻̳͎̪̑̒͗̓́͐̐̇͐̍͛͗̀̎̄͋̀̄̉̔̽͊̐́̂̀̒͆͗͑̑̊̀̀̊̌̿̀́́̉̋́̄̐̍̌͋̐̈́̽̓̓̅̇̍͂͐͋̒̚̕͜͜͠͝͠͝͝h̷̡̡̛̥̭̩̙͇͓̣̜̺̼̖͓̩̗͖̖͚ͅh̷̡̧̡̡̡̧̨̢̢̨̨̢̡̧̧̗͕̥͕̖̹͇̳̻̟̖̘̥͙͚̯̺͇͓̗͕̪͎̰̺̲̞̼̰̹͕̹̠͚̻͍̺͈̪̱̙̦͇̰̼͍͎͍͇̰̳̼̣̟̹̩̹̣̗͉̮͕̱̻̙̘͓͓̼̬͇̗͇̗̬̰͎̤̳̳̩̝̗̱͎̮̲̖̜̩̰̮̯̯̰̳̫̪̲̘̪̘̩͇͇̠̍̏̐͊̎̍̾̀̚̕͜͜͜͜ͅͅh̵̨̡̨̛̛̦̦͙͔̣̫̞̱̰͔̘͎̬̻͉̺̺͇͎̣̻̗̘̼̹̺̯͈̰̗̗̩͙̼̟͇͇̯̬̠͙͙̩̱̖͑̏́̈́̅̆̔̾̆̎̍̍̈́̇̇̓̈́̐̈́̇̿̋͌́͑͛̐̆̌̐̇͗̂̉̀̿͂̿̃̅̈̈́̆̃̀̓͂͋̋̅̀̓̾̏̅̈͑̃̿͑͌͒̿͋̄̈͋̓̏̓̒̓̌̆͗͆̈̑͒̈̽̀̈́̽̾͗̓̈́̃͘͘̕͘͝͝͝͠͝͝͠ͅͅͅͅh̴̨̡̧̡̧̡̯͖͉̳̙͓̺͖͈̮̱̗̹͔̲̳͔̭̩̹̝̳̩̳̘͚͙̘͕̥̗̞͖̼̣͎̠̗̯̣͚͕̲̠̹͎̱͕͎̲̝͍̤̘̞̟̗͈͖͚͔͉̗̖͇̗͔̙̣̺̀̈́͊̾̉̎͐͌͊̆̾̌̋̔͊̍͑͐̑̂̇͒͗͗͐̌̒̉͆̑̀͐̀͋̊̚̚̕̚͝͠͠͝͠͝ͅͅ',







    // scary... but still ones i added
    "GMRT? more like ICUP. #OWNED",
    '<span style="color: rgb(255, 113, 160)">i do already have a link on the front page... but like... <a href="https://kayladotcom.org" target="_blank">kayladotcom.org</a>.... -kayla</span>',
]

var hoversound = document.createElement("audio")
hoversound.src = "/shared/sound/hover.wav"
hoversound.volume = 0.4
document.body.appendChild(hoversound)
class SocialLink extends HTMLElement {
    connectedCallback() {
        const img = this.getAttribute("img")
        const link = this.getAttribute("link")

        let ael = document.createElement("a")
        ael.href = link

        ael.addEventListener("mouseenter", function() {
            hoversound.currentTime = 0
            hoversound.play()
        })
        
        let imgel = document.createElement("img")
        imgel.src = `/shared/img/socials/${img}.gif`
        imgel.className = "topbaricon"
        ael.appendChild(imgel)

        this.appendChild(ael)
    }
}
customElements.define("social-link", SocialLink)

class TopBar extends HTMLElement {
    connectedCallback() {
        this.outerHTML = `
        <div class="topbar" id="topbar">
            
            <div class="topbaricons" id="topbaricons"></div>

            <div class="scrollingcontainer">
                <marquee id="marq" scrollamount="8">
                    frick
                </marquee>
            </div>
        </div>
        <br><br><br>

        `

        let marq = document.getElementById("marq")
                    
        let topick = Math.floor(Math.random() * canpick.length)
        let picked = canpick[topick]
        marq.innerHTML = picked
    }
}
customElements.define("top-bar", TopBar)

var style = document.createElement("link")
style.rel = "stylesheet"
style.href = "/shared/css/topbar.css"
document.head.appendChild(style)

let topbar = document.createElement("top-bar")
document.body.prepend(topbar)

let topbaricons = document.getElementById("topbaricons")

for(social of toadd) {
    let sociallink = document.createElement("social-link")
    sociallink.setAttribute("img", social.img)
    sociallink.setAttribute("link", social.link)

    topbaricons.appendChild(sociallink)
}

document.documentElement.lang = "en" // zalgo text makes it think its vietnamese
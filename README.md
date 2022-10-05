# Simple League of Legends In-House Bot 
A discord bot designed to organise League of Legends in-house custom games. 

Written in NodeJS using Discord.js

# How to download 
**Suggested running LTS version of [NodeJs (16.17.1)](https://nodejs.org/en/download/)**

1. Download or Clone this repository
2. Edit the `config.json` with a prefix and your Discord Bot Token
3. In a terminal, inside this project directory run `npm i`
4. `node src/index.js`
5. Your bot should be up and running!

## Note
The bot is made to be used by trustworthy players who want to improve and play in a competitive environment with similar, like-minded individuals. It will not translate well in an uncontrolled environment. 

# Getting started  
Note: ! is not the default prefix. Please set this in `config.json`

`!game` - Starts a queue in the specific channel. You can have multiple games running at once.

When a match is initiated, 5 buttons appear that represents a role in League of Legends. Once each position has 2 players (10 total players) the game starts.  3 Voice channels are created. 1 voice channel for each team. Then there is a lobby voice channel created which both teams can enter. All 10 members must then be ready up for the game to be tracked. Create the custom games in whichever fashion your server sees fit. I suggest using the Tournament draft along with [ProDraft](http://prodraft.leagueoflegends.com/)

Once the game is over, any participant can click the `Game Over` button, at which points **6 votes** are required for the game to have a Winner. 

For example:
1. Team Red wins the match. 
2. All Red team votes `Red Team wins` (5 votes)
3. 1 member of Blue also then votes `Red Team wins`
4. Red team is the declared winner.

TLDR: As long as the winning team votes that they won, and at least **one person** on the losing team confirms this, a winner will be declared.
If there are fewer than **6** votes within the 2 minutes, the game will be considered abandoned and neither team will be awarded a win. 

`!leaderboard` - All wins are tracked via this command. 
 
## Suggestions 

- Host this on a server. This way, games are readily available and more importantly, the wins do not reset. (I can provide a Video tutorial if I get enough requests, but there are plenty available on YouTube)

- I suggest creating 1 text channel where players can initiate `!game`, maybe in its own category. 


### Turn on force start

Forcefully start a game without 10 members (for testing).
Navigate to `build/src/Commands/gameFunctions/buttons.js`

At the very bottom of the file change this:

Before:
```javascript

    const row1 = new ActionRowBuilder().addComponents(new ButtonBuilder()
        .setCustomId("remove|" + id)
        .setLabel("Remove Sign Up")
        .setStyle(ButtonStyle.Danger));
    return [row, row1];
```

To this:

After:
```javascript

    const row1 = new ActionRowBuilder().addComponents(new ButtonBuilder()
        .setCustomId("remove|" + id)
        .setLabel("Remove Sign Up")
        .setStyle(ButtonStyle.Danger), new ButtonBuilder()
        .setCustomId("force|" + id)
        .setLabel("Force start")
        .setStyle(ButtonStyle.Danger));
    return [row, row1];

```

Save and re-run - `node src/index.js`.

### Win with fewer than 6 votes
Update both 6's in this [file](https://github.com/HenrySpartGlobal/In-House-Bot-NodeJS/blob/main/build/src/Commands/game.js#L110) to 1, or whatever number you are testing with. I suggest changing this back to 6 once complete.

## Improvements 
1. The auto-generated voice lobbies are not deleted once a game is over. Manual deletion is required. 
2. Any member of the server can run the `!game` command. This bot is not suggested in an uncontrolled environment
3. Probably many more - feel free to raise an issue/pull request

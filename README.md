# Simple League of Legends In-House Bot 
A discord bot designed to organise League of Legends in-house custom games. 
Written in NodeJS using Discord.js

## Note
The bot is made to be used by trustworthy players who want to improve and play in a competitive environment with similar, like-minded individuals. It will not translate well in an uncontrolled environment. 

# Getting started

## Prerequisites 
- LTS NodeJs (16.17.1)
- [Discord Bot](https://discord.com/developers/applications) with a Token 

### Running the bot

Clone or Download this repo
```
git clone git@github.com:HenrySpartGlobal/In-House-Bot-NodeJS.git
```

Edit the `config.json`

```json
{
    "token": "",
    "prefix": ""
}

```

Install dependencies 

```
npm i
```

Run the bot 
```
node src/index.js
```

# Use case and behaviour  
When a match is initiated, 5 buttons appear that represents a role in League of Legends. Once each position has 2 players (10 total players) the game starts.  3 Voice channels are created. 1 voice channel for each team. Then there is a lobby voice channel created which both teams can enter. All 10 members must be ready for the game to be tracked. 

Create the custom games in whichever fashion your server sees fit. I suggest using the Tournament draft along with [ProDraft](http://prodraft.leagueoflegends.com/)

Once the game is over, any participant can click the `Game Over` button, at which points **6 votes** are required for the game to have a Winner. 

For example:
1. Team Red wins the match. 
2. All Red team votes `Red Team wins` (5 votes)
3. 1 member of Blue also then votes `Red Team wins`
4. Red team is the declared winner.

TLDR: As long as the winning team votes that they won, and at least **one person** on the losing team confirms this, a winner will be declared.
If there are fewer than **6** votes within the 2 minutes, the game will be considered abandoned and neither team will be awarded a win. 

# Commands
**Note:** ! is not the default prefix. Please set this in `config.json`

`!game` - Starts a queue in the specific channel. You can have multiple games running at once.

`!leaderboard` - All wins are tracked via this command. 
 
## Suggestions 

- For the best experience, host this on a server. This way, games are readily available and more importantly, the leaderboard do not reset. I can provide a Video tutorial if I get enough requests.
- I suggest creating a specific text channel where players encouraged to initiate `!game`, and no where else. Like i mentioned at the start, this bot will not translate well in an uncontrolled environment.  

## Testing features
### Turn on force start
Forcefully start a game without 10 members (for testing).
Navigate to `build/src/Commands/gameFunctions/buttons.js`

At the very bottom of the file, update this:
```javascript

    const row1 = new ActionRowBuilder().addComponents(new ButtonBuilder()
        .setCustomId("remove|" + id)
        .setLabel("Remove Sign Up")
        .setStyle(ButtonStyle.Danger));
    return [row, row1];
```

To this:
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

## Notes 
1. The auto-generated voice lobbies are not deleted once a game is over. Manual deletion is required. 
2. Any member of the server can run the `!game` command, in any channel.

# Contributing
Please read CONTRIBUTING.md for details on our code of conduct, and the process for submitting pull requests to us.

# License
This project is licensed under the MIT License - see the LICENSE.md file for details

# Acknowledgments
[Cojored](https://cojored.com/)

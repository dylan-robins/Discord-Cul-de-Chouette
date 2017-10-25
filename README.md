# Discord - Cul de Chouette -v 0.2

A bot for playing the dice game "Cul de Chouette" on a Discord server.  
The game originally appears in French comedy series Kaamelot, and was subsequently developped into a full game by fans. You can find the rules here: [rules](http://blog.evolya.fr/index.php?post/06/03/2010/Les-regles-du-Cul-de-Chouette)

## Getting Started

You must have NodeJS installed. [link](https://nodejs.org/en/)  
You must have a text editor.  
You'll need a Discord account to test your bot.

Clone the repo onto your hard drive, then install Discord's dependencies using NPM:
```
npm install discord.io winston --save
```

Now you need to follow [this](https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token) tutorial to setup your discord app. Make sure to note down your bot token.

Now you need to create the files that the bot need in order to run.  
First of all create a file in the root directory of the repo called `auth.json`. You'll need to open it in your editor and write this in it:  
```json
{
   "token": "YOUR-BOT-TOKEN"
}
```
Now create another file called `scores.json` in the same place. Again, open it and paste this in:
```
[]
```
Yes, just that. The file is imported by the bot as an array, and will be populated by the player's scores.

All done! To run the bot simply open a terminal in the repo folder and run:
```
node bot.js
```

## To do

* Refactor code. It's a horrendous mess.
* Write point counting system
* Make bot more interactive (host "game sessions" etc...)
* Optimize file i/o

## Authors

* **Dylan Robins** - *Initial work*
* **Vincent Charrel** - *Initial concept*

## License

This project is licensed under the GNU GPL3 License - see the [LICENSE](LICENSE) file for details

## Acknowledgments

Thanks to Alexandre Astier, creator of Kaamelot, for creating the game.

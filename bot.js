//checks if the file exists.
//If it does, it just calls back.
//If it doesn't, then the file is created.
function fileExists(filename) {
  fs.exists(filename, function(exists) {
    if (exists) {
      console.log(filename + " already exists. Continuing...");
    } else {
      console.log(filename + " doesn't exist.Creating new file...");
      fs.writeFile(filename, {flag: 'wx'});
      console.log("Finished. Continuing...");
    }
  });
}

var fs = require('fs');
var scores = require('./scores.json');
var auth = require('./auth.json');
var Discord = require('discord.io');
var logger = require('winston');



//function file
var fct = require('./functions.js')();


//help text
var help_txt = `
**Cul de chouette v0.2**
Un bot pour jouer au cul de chouette.
Règles: http://blog.evolya.fr/index.php?post/06/03/2010/Les-regles-du-Cul-de-Chouette

Commandes:
!help : affiche ce message (boulet)
!addu : vous rajoute dans la liste des joueurs
!addp : ajoute des points à votre score
!roll _n_ _s_: lance n dés, et si s=1 enregistre le lancer
`

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
  colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
  token: auth.token,
  autorun: true
});
bot.on('ready', function(evt) {
  logger.info('Connected');
  logger.info('Logged in as: ');
  logger.info(bot.username + ' - (' + bot.id + ')');
});


// MAIN FUNCTION
bot.on('message', function(user, userID, channelID, message, evt) {
  // Our bot needs to know if it will execute a command
  // It will listen for messages that will start with `!`
  if (message.substring(0, 1) == '!') {
    var args = message.substring(1).split(' ');
    var cmd = args[0];
    args = args.splice(1);

    switch (cmd) {
      case 'help':
        bot.sendMessage({
          to: channelID,
          message: help_txt
        })
        break;
      case 'addu':
        status = addUser(scores, userID, 0);
        blabla = "";
        if (status == 1) {
          blabla = "Vous avez été rajouté à la liste des joueurs!";
        } else if (status == -1) {
          blabla = "Oops, une erreur s'est produite lors de l'enregistrement du fichier...";
        } else if (status == -2) {
          blabla = "Vous êtes déjà enregistré comme joueur.";
        } else {
          blabla = "Une erreur inconue s'est produite";
        }
        bot.sendMessage({
          to: channelID,
          message: blabla
        })
        break;
      case 'score':
        score = getScore(scores, userID);
        if (score == -1) {
          bot.sendMessage({
            to: channelID,
            message: "Vous n'êtes pas un joueur. Enregistrez vous comme joueur avec la commande `!addu`"
          })
        } else {
          bot.sendMessage({
            to: channelID,
            message: "Score de <@" + userID + ">: " + score
          })
        }
        break;
      case 'addp':
        var points = addPoints(scores, userID, args[0]);
        bot.sendMessage({
          to: channelID,
          message: "Nouveau score de <@" + userID + ">: " + points
        })
        break;
      case 'roll':
        var returnVal = roll(scores, userID, args[0], args[1]);
        var dice = returnVal[0];
        var combi = returnVal[1];
        if (returnVal.length == 2) {
          var str = "<@" + userID + ">: " + args[0] + "d6 = " + dice + ": " + combi;
        } else if (returnVal.length == 1) {
          var str = "<@" + userID + ">: " + args[0] + "d6 = " + dice;
        }
        bot.sendMessage({
          to: channelID,
          message: str
        })
    }
  }
});

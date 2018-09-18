var fs = require("fs");
//Reverse array search, credit Chris Pickett, https://stackoverflow.com/a/7178381
var findWithAttr = function(array, attr, value) {
  for(var i = 0; i < array.length; i += 1) {
      if(array[i][attr] == value) {
          return i;
      }
  }
  return -1;
}

module.exports = function() {
  // Sync scores array in memory to file on disk
  // Returns 1 on success, 0 on failiure.
  this.syncFile = function(arr){
    fs.writeFile("scores.json", JSON.stringify(arr, null, 2), function(err) {
      if (err) {
        //file save failed
        console.log(err);
        return 0;
      }
      else {
        console.log("file saved");
        return 1;
      }
    })
  }

  // Add username and score to array and file
  // Returns 1 on success, 0 on file save error, -2 on player existance
  this.addUser = function(arr, userID, score) {
    var playerExists = 0;
    userID = userID.toString();
    var to_add = {"userID": userID, "score": score, "dice1-2": {}, "dice3": {}};

    for (var player in arr) {
        //check if player already exists
        if (arr[player]["userID"] == userID) {
          var playerExists = 1;
        }
    }
    if (playerExists == 0){
      //Save new player info to file
      arr.push(to_add);
      var done = syncFile(arr);
      return done;
    }
    else {
      //skip save process and say player already exists
      return -2
    }
  }

  //get score associated with userID out of scores array
  this.getScore = function(arr, user) {
    var pos = findWithAttr(arr, "userID", user)
    if  (pos >= 0) {
      return arr[pos]["score"];
    } else {
      return -1;
    }
  }

  //add points to user's score
  this.addPoints = function(arr, user, points) {
    var new_score = parseInt(getScore(arr, user)) + parseInt(points);
    var pos = findWithAttr(arr, "userID", user)
    if  (pos >= 0) {
      arr[pos]["score"] = new_score;
    } else {
      return -1;
    }
    syncFile(arr);
    return new_score;
  }

  //roll n 6 sided dice
  this.roll = function(arr, user, n, save = 0) {
    var dice = new Array;
    var returnVal = new Array;

    //roll n dice
    for (i = 0; i < n; i++) {
      dice.push((Math.floor(Math.random()*100))%6 + 1);
    }
    returnVal.push(dice);

    //to save or not to save
    if (save == 1) {
      //Save roll to personal file
      var combi = diceSave(arr, user, dice);
      if (combi) {
        returnVal.push(combi);
      }
    }
    return returnVal;
  }

  //stick dice values in array
  this.diceSave = function(arr, user, dice) {
    console.log("diceSave called");
    var returnVal;

    //find pos of user in array
    var pos = findWithAttr(arr, "userID", user)

    //set vars for arr positions because it's too long to type each time
    var dice1_2 = arr[pos]["dice1-2"];
    var dice3 = arr[pos]["dice3"];

    //if user exists
    if  (pos >= 0) {
      if (Object.keys(dice).length == 2 && Object.keys(dice1_2).length == 0) {
        dice1_2 = dice;
      }
      else if (Object.keys(dice).length == 1 && Object.keys(dice3).length == 0) {
        dice3 = dice;
      }
    }

    arr[pos]["dice1-2"] = dice1_2;
    arr[pos]["dice3"] = dice3;

    //if dice slots are all full
    if (arr[pos]["dice1-2"].length == 2 && arr[pos]["dice3"].length == 1) {
      //concatenate dices 1, 2 and 3 into one array and check the combi
      console.log("arr full");
      returnVal = checkDiceCombi(arr[pos]["dice1-2"].concat(arr[pos]["dice3"]));
      arr[pos]["dice1-2"].length = 0;
      arr[pos]["dice3"].length = 0;
    }

    //save values
    arr[pos]["dice1-2"] = dice1_2;
    arr[pos]["dice3"] = dice3;
    syncFile(arr);

    return returnVal;
  }

  //retrun name of roll
  this.checkDiceCombi = function(dice) {
    var combi = "";
    var points;
    dice.sort(function(a, b){return b-a});
    //three identical dice
    if ((dice[0]==dice[1]) && (dice[0]==dice[2]) && (dice[1]==dice[2])) {
      combi = "cul de chouette";
    }
    //Three successive dice
    else if ((dice[0]==(dice[1]+1)) && (dice[0]==dice[2]+2)) {
      combi = "suite";
    }
    //One dice = sum of other two and two identical dice
    else if ((dice[0]==(dice[1]+dice[2])) && ((dice[0]==dice[1]) || (dice[0]==dice[2]) || (dice[1]==dice[2]))) {
      combi = "chouette velute";
    }
    //One dice == sum of other two
    else if (dice[0]==(dice[1]+dice[2])) {
      combi = "velute"
    }
    //Two identical dice
    else if ((dice[0]==dice[1]) || (dice[0]==dice[2]) || (dice[1]==dice[2])) {
      combi = "chouette";
    }
    //421
    else if (dice[0]==4 && dice[1]==2 && dice[2]==1) {
      combi = "souflette";
    }
    else {
      combi = "néant";
    }
    return combi;
  }
}

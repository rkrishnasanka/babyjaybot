'use strict';

var util = require('util');
var path = require('path');
var fs = require('fs');
var SQLite = require('sqlite3').verbose();
var Bot = require('slackbots');

/**
 * Constructor function. It accepts a settings object which should contain the following keys:
 *      token : the API token of the bot (mandatory)
 *      name : the name of the bot (will default to "norrisbot")
 *      dbPath : the path to access the database (will default to "data/norrisbot.db")
 *
 * @param {object} settings
 * @constructor
 *
 * @author Luciano Mammino <lucianomammino@gmail.com>
 */
var BabyJayBot = function Constructor(settings) {
    this.settings = settings;
    this.settings.name = this.settings.name || 'babyjaybot';
    console.log(this.settings.name);
    this.dbPath = settings.dbPath || path.resolve(__dirname, '..', 'data', 'norrisbot.db');

    this.user = null;
    this.db = null;
};

// inherits methods and properties from the Bot constructor
util.inherits(BabyJayBot, Bot);

/**
 * Run the bot
 * @public
 */
BabyJayBot.prototype.run = function () {
    BabyJayBot.super_.call(this, this.settings);
    console.log(JSON.stringify(this.users));
    this.on('start', this._onStart);
    this.on('message', this._onMessage);
    this.on('error', function(e){
      console.error(e);
    });
};

/**
 * On Start callback, called when the bot connects to the Slack server and access the channel
 * @private
 */
BabyJayBot.prototype._onStart = function () {
  console.log("Starting bot");
  var params = {
      icon_emoji: ':cat:'
  };

  // define channel, where bot exist. You can adjust it there https://my.slack.com/services
  this.postMessageToChannel('general', 'Hello ! I am babyjaybot I am here to make CIDAR Slack awesome !', params);
  //Do other checks later on
};

/**
 * On message callback, called when a message (of any type) is detected with the real time messaging API
 * @param {object} message
 * @private
 */
BabyJayBot.prototype._onMessage = function (message) {
    console.log("rx the message: "  +  JSON.stringify(message));
    if (this._isChatMessage(message) &&
        this._isChannelConversation(message)){
      console.log('is chat message');
      console.log('is channel conversation');
    }

    if(!this._isFromBabyJayBot(message)){
      console.log('is from baby jay bot');
    }else {
      console.log('not from baby jay bot');
    }

    if(this._isMentioningBabyJay(message)){
      console.log('mentions jay');
    }else{
      console.log('does not mention jay');
    }
    // ) {
    //     console.log('add code to post baby jay picture');
    // }
};

/**
 * Loads the user object representing the bot
 * @private
 */
BabyJayBot.prototype._loadBotUser = function () {
    var self = this;
    this.user = this.users.filter(function (user) {
        return user.name === self.name;
    })[0];
};

/**
 * Open connection to the db
 * @private
 */
BabyJayBot.prototype._connectDb = function () {
    if (!fs.existsSync(this.dbPath)) {
        console.error('Database path ' + '"' + this.dbPath + '" does not exists or it\'s not readable.');
        process.exit(1);
    }

    this.db = new SQLite.Database(this.dbPath);
};

/**
 * Check if the first time the bot is run. It's used to send a welcome message into the channel
 * @private
 */
BabyJayBot.prototype._firstRunCheck = function () {
    var self = this;
    self._welcomeMessage();
};

/**
 * Sends a welcome message in the channel
 * @private
 */
BabyJayBot.prototype._welcomeMessage = function () {
    this.postMessageToChannel('general', 'Hello everyone ! My name is Baby Jay' +
        '\n I can tell jokes, but very honest ones. Just say `Baby Jay` or `' + this.name + '` to invoke me!',
        {as_user: true});
        console.log("Posted welcome message: "+this.channels[0].name);
};

/**
 * Util function to check if a given real time message object represents a chat message
 * @param {object} message
 * @returns {boolean}
 * @private
 */
BabyJayBot.prototype._isChatMessage = function (message) {
    return message.type === 'message' && Boolean(message.text);
};

/**
 * Util function to check if a given real time message object is directed to a channel
 * @param {object} message
 * @returns {boolean}
 * @private
 */
BabyJayBot.prototype._isChannelConversation = function (message) {
    return typeof message.channel === 'string' &&
        message.channel[0] === 'C'
        ;
};

/**
 * Util function to check if a given real time message is mentioning Chuck Norris or the norrisbot
 * @param {object} message
 * @returns {boolean}
 * @private
 */
BabyJayBot.prototype._isMentioningBabyJay = function (message) {
    return message.text.toLowerCase().indexOf('jay') > -1 ||
        message.text.toLowerCase().indexOf(this.name) > -1;
};

/**
 * Util function to check if a given real time message has ben sent by the norrisbot
 * @param {object} message
 * @returns {boolean}
 * @private
 */
BabyJayBot.prototype._isFromBabyJayBot = function (message) {
    return message.user === this.user;
};

/**
 * Util function to get the name of a channel given its id
 * @param {string} channelId
 * @returns {Object}
 * @private
 */
BabyJayBot.prototype._getChannelById = function (channelId) {
    return this.channels.filter(function (item) {
        return item.id === channelId;
    })[0];
};

module.exports = BabyJayBot;

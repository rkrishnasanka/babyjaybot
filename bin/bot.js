#!/usr/bin/env node

'use strict';

/**
 * BabyJayBot launcher script.
 *
 * @author Luciano Mammino <lucianomammino@gmail.com>
 */

var BabyJayBot = require('../lib/babyjaybot');

/**
 * Environment variables used to configure the bot:
 *
 *  BOT_API_KEY : the authentication token to allow the bot to connect to your slack organization. You can get your
 *      token at the following url: https://<yourorganization>.slack.com/services/new/bot (Mandatory)
 *  BOT_DB_PATH: the path of the SQLite database used by the bot
 *  BOT_NAME: the username you want to give to the bot within your organisation.
 */
var token = process.env.BOT_API_KEY || require('../token');
console.log(token);
var dbPath = process.env.BOT_DB_PATH;
var name = process.env.BOT_NAME;

var babyjaybot = new BabyJayBot({
    token: token,
    dbPath: dbPath,
    name: name
});

babyjaybot.run();

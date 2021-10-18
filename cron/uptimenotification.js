var async = require("async");
var cron = require('node-cron');
const nodemailer = require('nodemailer');
var moment = require('moment');
const axios = require('axios');

var Account = require('../models/account');
var User = require('../models/user');
var Check = require('../models/check');

// mail
let transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 465,
  secure: true, // upgrade later with STARTTLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

cron.schedule('*/30 * * * *', updateNodeUptime);

function updateNodeUptime() {
  console.log('UPTIME NOTIFICATION: Started');
  Account.find()
    .where('votingweight').gte(100000000000000000000000000000000) // 1000 BANANO minimum
    .populate('owner')
    .exec(function (err, accounts) {
      if (err) {
        console.error('UPTIME NOTIFICATION:', err);
        return
      }
      console.log('UPTIME NOTIFICATION: ' + accounts.length + " accounts");

      async.forEachOfSeries(accounts, (account, key, callback) => {

        checkNodeUptime(account, callback);

      }, err => {
        if (err) {
          console.error(err.message);
          return
        }
        console.log('UPTIME NOTIFICATION: Done');
      });
    });
}

function checkNodeUptime(account, callback) {
  var previous = account.uptime_data.last;
  if (account.lastVoted && moment(account.lastVoted).isAfter(moment().subtract(30, 'minutes').toDate())) {
    account.uptime_data.up++;
    account.uptime_data.last = true;
  } else {
    account.uptime_data.down++;
    account.uptime_data.last = false;
  }
  account.uptime = ((account.uptime_data.up / (account.uptime_data.up + account.uptime_data.down)) * 100);

  var check = new Check();
  check.account = account._id;
  check.isUp = account.uptime_data.last;
  check.save();

  if (account.alias) {
    var title = account.alias;
  } else {
    var title = account.account;
  }

  if (account.owner) {
    if(account.owner.discord){
      var discordprefix = '<@' + account.owner.discord.id + '> Your ';
    } else {
      var discordprefix = 'The ';
    }

    if (previous === true && account.uptime_data.last === false) {
      console.log('UPTIME NOTIFICATION: ' + account.account + ' went down!');

      account.owner.getEmails().forEach(function (email) {
        sendDownMail(account, email);
        sendDiscord(discordprefix + 'Nano representative **' + title + '** is down! https://mynano.ninja/account/' + account.account);
      });

    } else if (previous === false && account.uptime_data.last === true) {
      console.log('UPTIME NOTIFICATION: ' + account.account + ' went up!');

      account.owner.getEmails().forEach(function (email) {
        sendUpMail(account, email);
        sendDiscord(discordprefix + 'Nano representative **' + title + '** is up again. https://mynano.ninja/account/' + account.account);
      });
    }
  }

  account.save(function (err) {
    if (err) {
      console.log("UPTIME NOTIFICATION: Error saving account", err);
    }
    account.updateUptimeFor('day')
    callback();
  });
}

function sendUpMail(account, email) {

  if (account.alias) {
    var title = account.alias;
  } else {
    var title = account.account;
  }

  if (account.lastVoted) {
    var lastvote = 'Last voted ' + moment(account.lastVoted).fromNow();
  } else {
    var lastvote = 'Never noted';
  }

  var body = 'The Banano representative ' + title + ' is up again.<br>' +
    lastvote + '.<br>' +
    'Address: ' + account.account + '<br><br>' +
    '<a href="https://mybanano.ninja/account/' + account.account + '">View on My Banano Ninja</a>'

  sendMail('UP: ' + title, body, email);
}

function sendDownMail(account, email) {

  if (account.alias) {
    var title = account.alias;
  } else {
    var title = account.account;
  }

  if (account.lastVoted) {
    var lastvote = 'Last voted ' + moment(account.lastVoted).fromNow();
  } else {
    var lastvote = 'Never noted';
  }

  var body = 'The Banano representative ' + title + ' is down.<br>' +
    lastvote + '.<br>' +
    'Address: ' + account.account + '<br><br>' +
    '<a href="https://mybanano.ninja/account/' + account.account + '">View on My Banano Ninja</a>'

  sendMail('DOWN: ' + title, body, email);
}

function sendMail(subject, body, email) {
  var data = {
    from: 'My Banano Ninja <alert@mybanano.ninja>',
    to: email,
    subject: subject,
    html: body
  }
  transporter.sendMail(data, function(err) {
    if (err) {
        console.error('UPTIME NOTIFICATION: sendMail', err)
    }
    console.log('UPTIME NOTIFICATION: Mail sent');
    
  });
}

function sendDiscord(content) {
  axios.post(process.env.DISCORD_HOOK, {
    content: content
  })
  .then(function (response) {
    //console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
}
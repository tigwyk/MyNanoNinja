const {
  Nano
} = require('nanode');
var cron = require('node-cron');

const nano = new Nano({
  url: process.env.NODE_RPC
});

var available = 340280726399000000000000000000000000000;
var online_stake_total = 172830129793959086457361869776702307222;
var trended_stake_total = 125191805873600533967279352598929548330;
var blockcount = 0;

function getAvailable(){
  return available;
}

function getOnlineStakeTotal(){
  return online_stake_total;
}

function getTrendedStakeTotal(){
  return trended_stake_total;
}

function getBlockcount(){
  return blockcount;
}

// update all local vars
cron.schedule('* * * * *', updateLocalVars);

// update the all local vars now
updateLocalVars();

function updateLocalVars(){
  updateBlockcount();
  updateAvailable();
  updateStakes();
}

function updateAvailable(){
  nano.available()
  .then((data) => {
    available = data;
    console.log('RPC: Available Supply: ' + available);
  })
  .catch( reason => {
    console.error( 'onRejected function called: ', reason );
  });
}

function updateBlockcount(){
  console.log('RPC: Updating Blockcount...');
  nano.blocks.count()
  .then((blocks) => {
    blockcount = blocks.count;
    console.log('RPC: Current Blockcount: ' + blockcount);
  })
  .catch( reason => {
    console.error( 'onRejected function called: ', reason );
  });
}

function updateStakes(){
  console.log('RPC: Updating current stakes...');
  nano.rpc("confirmation_quorum")
  .then((result) => {
    online_stake_total = result.online_stake_total;
    trended_stake_total = result.trended_stake_total;
  })
  .catch( reason => {
    console.error( 'onRejected function called: ', reason );
  });
}

module.exports = {
  rpc: nano, 
  getAvailable: getAvailable,
  getOnlineStakeTotal: getOnlineStakeTotal,
  getTrendedStakeTotal: getTrendedStakeTotal,
  getBlockcount: getBlockcount
};

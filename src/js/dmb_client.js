/**
 *
 * Simple integration with DMB
 *
 */
var config = require("config");
var io = require("socket.io");
var watch = require("watch");

var dmb = config.dmb;
dmb.socket = null;

dmb.init = function(token) {
  console.log('dmb init called with: ' + token);

  if (typeof(token) !== 'undefined')
  {
    if (! dmb.socket) {
      dmb.socket = io(config.dmb.server);

      if (typeof dmb.params.bkid == 'undefined' || dmb.params.bkid == '')
      {
        // the default channel
        dmb.params.bkid = 'signo';
      }

      dmb.params.token = token;

      // say hello to DMB
      dmb.socket.emit('dmb:connect', dmb.params);

      // want to hook into this one?
      dmb.socket.on('disconnect', function(msg)
      {
        console.log('dmb.socket disconnect');
      });

      // want to hook into this one?
      dmb.socket.on('dmb:connected', function(msg)
      {
        console.log('dmb.socket dmb:connected');
      });

      // received a broadcast from DMB
      dmb.socket.on('dmb:broadcast', function(msg)
      {
        console.log('dmb.socket dmb:broadcast: ' + msg);
        watch.send({'BROADCAST_KEY': msg});
      });

      // received a direct message from DMB
      dmb.socket.on('dmb:message', function(msg)
      {
        console.log('dmb.socket dmb:message: ' + msg);
        try {
          var json = JSON.parse(msg);
          console.log('check json.to vs dmb.params.token: ' + json.to + ' vs ' + dmb.params.token);
          if (typeof json.to === 'undefined' || json.to == dmb.params.token) {
            watch.send({'MESSAGE_KEY': json.payload});
          }
        } catch (e) {
          console.log('JSON decoding error: ' + e.message);
        }
      });

      // received a direct alert from DMB
      dmb.socket.on('dmb:alert', function(msg)
      {
        console.log('dmb.socket dmb:alert: ' + msg);
        try {
          var json = JSON.parse(msg);
          watch.send({'ALERT_KEY': json.payload});
        } catch (e) {
          console.log('JSON decoding error: ' + e.message);
        }
      });

      // received data from DMB
      dmb.socket.on('dmb:data', function(msg) {
        console.log('dmb.socket dmb:data');
      });
    } else {
      console.log('dmb.socket already active');
    }
  }
};

dmb.deinit = function(token) {
  console.log('dmb deinit called with: ' + token);
  if (typeof dmb.socket !== 'undefined') {
    // say bye to DMB
    dmb.socket.emit('disconnect');
    dmb.socket.disconnect();
    dmb.socket = null;
  }
}

dmb.message = function(token_to, text) {
  console.log('dmb message called with: ' + text);
  dmb.params.to = token_to;
  dmb.params.payload = text;
  dmb.socket.emit('dmb:message', dmb.params);
  console.log(JSON.stringify(dmb.params));
}

dmb.alert = function(token_to, text) {
  console.log('dmb alert called with: ' + text);
  dmb.params.to = token_to;
  dmb.params.payload = text;
  dmb.socket.emit('dmb:alert', dmb.params);
  console.log(JSON.stringify(dmb.params));
}

dmb.log = function(token_to, text) {
  console.log('dmb log called with: ' + text);
  dmb.params.to = token_to;
  dmb.params.payload = text;
  dmb.socket.emit('dmb:log', dmb.params);
  console.log(JSON.stringify(dmb.params));
}

module.exports = dmb;

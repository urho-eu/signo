/**
 *
 * Signo UI control
 *
 */

/**
 *
 */
jQuery(document).ready(function()
{
  //
  jQuery('.client').on('click', function(event) {
    var id = jQuery(this).attr('data-id');
    console.log('id: ' + id);
    jQuery('.clients .client[data-id="' + id + '"]').addClass('active');
    jQuery('.clients .client[data-id!="' + id + '"]').removeClass('active');
  });

  // reset alerts
  jQuery('.alerts .indicator').on('dblclick', function(event) {
    if (jQuery(this).hasClass('alert')) {
      var type = jQuery(this).attr('data-type');
      jQuery(this).removeClass('alert');
      signoLog('log', 'Online assistant has reset ' + type + ' alert.', true);
    }
  });
});

/**
 * Add mesages or events to the appropriate containers
 */
function signoLog(type, message, classes) {
  var containerId = '#messages';
  var payload = moment().format('YYYY-MM-DD hh:mm:ss') + ': ' + message;
  var newLine = jQuery('<li>').text(payload);

  if (classes) {
    newLine.addClass(classes);
  }

  switch (type) {
    case 'message':
      containerId = '#messages';
      break;
    case 'log':
      containerId = '#logs';
      break;
    case 'alert':
      containerId = '#logs';
      break;
    case 'broadcast':
      containerId = '#broadcasts';
      break;
  }

  newLine.addClass(type);

  jQuery(containerId).prepend(newLine);
}

/**
 * Select client handler
 */
function handlerSelectClient(event) {
  var id = jQuery(event.target).attr("data-id");
  console.log("id: " + id);
  jQuery('.clients .client[data-id="' + id + '"]').addClass('active');
  jQuery('.clients .client[data-id!="' + id + '"]').removeClass('active');

  jQuery('.details [data-id="' + id + '"]').removeClass('hidden');
  jQuery('.details [data-id!="' + id + '"]').addClass('hidden');
}

/**
 * Check watch ID
 */
function checkWatchId(event) {
  var id = jQuery('.patient .watch').text();
  console.log('Watch ID: ' + id);
  if (id === "") {
    jQuery('.alerts .connection').addClass('alert');
  } else {
    jQuery('.alerts .connection').removeClass('alert');
  }
  return id;
}

/**
 * sets or resets fall alert icon
 */
function triggerAlertFall(flag) {
  (flag == true) ? jQuery('.alerts .fall').addClass('alert') :
    jQuery('.alerts .fall').removeClass('alert');
}

/**
 * sets or resets nomove alert icon
 */
function triggerAlertNoMove(flag) {
  (flag == true) ? jQuery('.alerts .nomove').addClass('alert') :
    jQuery('.alerts .nomove').removeClass('alert');
}

/**
 * sets or resets heart alert icon
 */
function triggerAlertHeart(flag) {
  (flag == true) ? jQuery('.alerts .heart').addClass('alert') :
    jQuery('.alerts .hearth').removeClass('alert');
}

/**
 * handler for "dmb:connected"
 */
function handlerDmbConnected(json) {
  console.log("handlerDmbConnected: " + JSON.stringify(json));
  if (json.token == dmb_params.bkid) return;

  try {
    // check if allowed to receive from this token
    if (typeof dmb_params.allowed[json.token] !== 'undefined') {
      jQuery('.patient .watch').text(json.token);
      checkWatchId();
      signoLog('log', 'Patient watch is (re)connected.');
    }
  } catch (e) {
    console.log('JSON decoding error: ' + e.message);
    signoLog('message', json, false);
    return;
  }

  //~ jQuery('.dmb .status').addClass('active');
  //~ // add new row to the clients
  //~ var client = jQuery(".client.dummy").clone();
  //~ client.toggleClass('hidden').toggleClass('dummy');
  //~ client.attr('data-id', msg.token);
  //~ client.text(msg.token);
  //~ client.on("click", handlerSelectClient);
  //~ client.prependTo(".clients");
  //~ // add details
  //~ var details = jQuery(".details.dummy").clone();
  //~ details.toggleClass('hidden').toggleClass('dummy');
  //~ details.attr('data-id', msg.token);
  //~ details.text(msg.token);
  //~ details.parent().add(details);
}

/**
 * handler for 'dmb:broadcast'
 */
function handlerDmbBroadcast(msg) {
  signoLog('broadcast', msg.payload);
}

/**
 * handler for 'dmb:log'
 */
function handlerDmbLog(msg) {
  signoLog('log', msg.payload);
}

/**
 * form submit handler for sending message
 */
function handlerMessageSubmit(socket) {
  var to = jQuery('.patient .watch').text();
  var msg_length = jQuery('form input').val().length;

  // todo: check if token is allowed to send..
  if (to.length > 0 && msg_length > 0) {
    var msg = jQuery('#m').val();
    console.log('message to ' + to + ': ' + msg);
    socket.emit('dmb:message', {
      bkid: dmb_params.bkid,
      token: dmb_params.bkid,
      payload: msg,
      to: to
    });
    jQuery('#m').val('');
    signoLog('message', msg, 'backend');
    signoLog('log', 'Assistant to patient: ' + msg);
  }
  return false;
}

/**
 * handler for "dmb:message" type
 */
function handlerDmbMessage(msg) {
  try {
    var json = JSON.parse(msg);
    // check if allowed to receive from this token
    if (typeof dmb_params.allowed[json.token] !== 'undefined') {
      switch (json.payload) {
        case 'login':
          jQuery('.patient .watch').text(json.token);
          checkWatchId();
          signoLog('log', 'Patient watch is (re)connected.');
          break;
        default:
          signoLog('message', json.payload, 'client');
          signoLog('log', 'Patient sent to assistant: ' + json.payload);
      }
    }
  } catch (e) {
    console.log('JSON decoding error: ' + e.message);
    signoLog('message', msg, false);
    return;
  }
}

/**
 * handler for "dmb:alert" type
 */
function handlerDmbAlert(msg) {
  try {
    var json = JSON.parse(msg);
    // check if allowed to receive from this token
    if (typeof dmb_params.allowed[json.token] !== 'undefined') {
      switch (json.payload) {
        case dmb_params.alerts.ALERT_FALL:
          signoLog('message', 'I felt down and need help!', 'client');
          signoLog('alert', "Patient felt down and needs help.");
          triggerAlertFall(true);
          break;
        case dmb_params.alerts.ALERT_NOMOVE:
          signoLog('message', 'I can not move and need help!', 'client');
          signoLog('alert', "Patient can not move and needs help.");
          triggerAlertNoMove(true);
          break;
        case dmb_params.alerts.ALERT_HEALTH:
          signoLog('message', 'I need urgent help!', 'client');
          signoLog('alert', "Patient needs urgent help.");
          triggerAlertHeart(true);
          break;
      }
    }
  } catch (e) {
    console.log('JSON decoding error: ' + e.message);
    signoLog('message', msg, false);
    return;
  }
}

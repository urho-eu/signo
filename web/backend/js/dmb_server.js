/**
 *
 * Simple server script for Duplex Message Broker (DMB)
 *
 */
jQuery(document).ready(function()
{
  // load Signo UI contolr
  jQuery.getScript("js/signo.js")
    .done(function(script, textStatus ) {
      // todo
      jQuery(".client").on('click', handlerSelectClient);
    })
    .fail(function(jqxhr, settings, exception ) {
      console.log("Missing signo.js; aborting");
      jQuery(".dmb .message").text("Missing UI control; aborting.");
      return;
    });

  // load config
  jQuery.getScript("js/params.js")
    .done(function(script, textStatus ) {
      initDmb(dmb_params);
    })
    .fail(function(jqxhr, settings, exception ) {
      console.log("Missing params.js; aborting");
      jQuery(".dmb .message").text("Missing parameters; aborting.");
      return;
    });

  /**
   * Load socket.io and trigger startdmb
   */
  function initDmb(dmb_params) {
    // load socket.io
    jQuery.getScript("/socket.io/socket.io.js")
      .done(function(script, textStatus ) {
        // initiate the DMB connection
        jQuery(document).trigger('startdmb', dmb_params);
        console.log(textStatus + ' startdmb triggered');
      })
      .fail(function(jqxhr, settings, exception ) {
        jQuery(".dmb .message").text("Triggered ajaxError handler.");
      });
  }
});

// dmb magic; connect to web socket; parse messages etc.
jQuery(document).on('startdmb', function(event, dmb_params)
{
  checkWatchId();
  var socket = io();
  // setup handlers
  socket.emit('dmb:connect', dmb_params);
  jQuery('form').submit(function(event) {
    event.preventDefault();
    handlerMessageSubmit(socket)
  });
  socket.on('dmb:connected', handlerDmbConnected);
  socket.on('dmb:broadcast', handlerDmbBroadcast);
  socket.on('dmb:message', handlerDmbMessage);
  socket.on('dmb:alert', handlerDmbAlert);
  socket.on('dmb:log', handlerDmbLog);
});

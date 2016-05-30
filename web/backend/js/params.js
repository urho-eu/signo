/**
 * DMB parameters
 */
var dmb_params = {
  // FEEL FREE TO CONFIGURE
  bkid: 'signo',
  token: 'signo',
  // allowed tokens that can talk to this server instance
  allowed: {
    'signo': 1,
    '737199bf78fda80e095931fd1dcae8a2': 1,
    '5b9764a804249ee885a7475bb6e0bec7': 1
  },
  // PLEASE DO NOT CHANGE
  // alert codes must be in sync with the clients' system
  alerts: {
    'ALERT_FALL': 61,
    'ALERT_NOMOVE': 62,
    'ALERT_HEALTH': 63,
    'ALERT_CONNECTION': 64
  },
};

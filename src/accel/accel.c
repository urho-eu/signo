#include <pebble.h>
#include <inttypes.h>

#include "accel.h"
#include "comm/comm.h"

int counter = 0;
bool alert = false;
static uint32_t threshold = 11000;
uint32_t last_samples[4][3] = {{ 0 }};

/**
 * The gesture that switches the page:
 * wrist twisted twice in quick succession (within half a second)
 */
void accel_data_handler(AccelData *data, uint32_t num_samples) {
  uint64_t timestamp = data->timestamp;
  uint32_t abs_accel = abs(data->x) + abs(data->y) + abs(data->z);

  //~ // record the last 10 sample
  //~ if (counter == 4) counter = 0;

  //~ if (! alert) {
    //~ //APP_LOG(APP_LOG_LEVEL_DEBUG_VERBOSE, "%d, %d, %d", data->x, data->y, data->z);
    //~ last_samples[counter][0] = data[0].x;
    //~ last_samples[counter][1] = data[0].y;
    //~ last_samples[counter][2] = data[0].z;
    //~ APP_LOG(APP_LOG_LEVEL_DEBUG_VERBOSE, "%d, %d, %d", last_samples[counter][0], last_samples[counter][1], last_samples[counter][2]);
    //~ counter += 1;
  //~ }

  if (threshold < abs_accel && data->did_vibrate == false) {
    //APP_LOG(APP_LOG_LEVEL_DEBUG_VERBOSE, "** fall: abs_accel: %lu => %d, %d, %d", (unsigned long)abs_accel, data->x, data->y, data->z);
    watch_sends_alert(ALERT_FALL);
    //~ alert = true;
    //~ for (int i=0; i < 10; i++) {
      //~ APP_LOG(APP_LOG_LEVEL_DEBUG_VERBOSE, "%d sample: %lu, %lu, %lu", i, (unsigned long)last_samples[i][0], (unsigned long)last_samples[i][1], (unsigned long)last_samples[i][2]);
    //~ }
  }
}

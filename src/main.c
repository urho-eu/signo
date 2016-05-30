#include <pebble.h>

#include "ui/ui.h"
#include "util/util.h"
#include "comm/comm.h"
#include "accel/accel.h"

void init() {
  init_appmessage_handlers();

  accel_service_set_sampling_rate(ACCEL_SAMPLING_100HZ);
  accel_data_service_subscribe(NUM_SAMPLES, accel_data_handler);

  window_push();
}

void deinit() {
  deinit_appmessage_handlers();
  accel_data_service_unsubscribe();
  destroy();
}

int main() {
  init();
  app_event_loop();
}

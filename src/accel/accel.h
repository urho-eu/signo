#pragma once

#include <pebble.h>

#define NUM_SAMPLES 1

bool measure;
uint64_t start_time;

void accel_data_handler(AccelData *data, uint32_t num_samples);
void accel_data_handler2(AccelData *data, uint32_t num_samples);

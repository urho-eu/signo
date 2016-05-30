#pragma once

#include <pebble.h>

#define DEFAULT_BG_COLOR GColorOrange //GColorBlack
#define DEFAULT_TICKER_COLOR GColorSpringBud
#define DEFAULT_FILL_COLOR GColorPastelYellow
#define DEFAULT_INVERSE_FILL_COLOR GColorWhite
#define DEFAULT_QUESTION_TEXT_COLOR GColorWhite
#define DEFAULT_QUESTION_FILL_COLOR GColorRed

void window_push();
void window_redraw();
void destroy();

void update_ticker(const char *text);
void update_question(const char *text);
void update_status(const char *text);

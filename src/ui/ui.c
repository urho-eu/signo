#include <pebble.h>
#include <inttypes.h>

#include "ui.h"
#include "comm/comm.h"
#include "util/util.h"
#include "i18n/i18n.h"

static Window *window;

static Layer *page0_layer;
static TextLayer *header_layer;
static TextLayer *ticker_layer;
static TextLayer *timer_layer;
static Layer *question_layer;
ActionBarLayer *answers_layer;

static GFont font_small, font_big, font_medium;

static char *current_ticker;
static char *current_question;
static char *current_status;
static char *timer_text;

GRect header_frame, timer_frame, ticker_start_frame, ticker_end_frame, question_start_frame;

/**
 * called when back btn pressed
 */
static void back_single_click_handler(ClickRecognizerRef recognizer, void *context) {
  APP_LOG(APP_LOG_LEVEL_DEBUG, i18n.pressed_back);
  watch_sends_command(DMB_RECONNECT);
  watch_sends_text(i18n.pressed_back);
}

/**
 * called when back btn pressed multiple times
 */
static void back_multi_click_handler(ClickRecognizerRef recognizer, void *context) {
  APP_LOG(APP_LOG_LEVEL_DEBUG, i18n.multi_pressed_back);
  watch_sends_command(WATCH_LOGIN);
  update_ticker(i18n.login);
}

/**
 * called when up btn pressed
 */
static void up_single_click_handler(ClickRecognizerRef recognizer, void *context) {
  APP_LOG(APP_LOG_LEVEL_DEBUG, i18n.pressed_up);
}

/**
 * called when up btn pressed multiple times
 */
static void up_multi_click_handler(ClickRecognizerRef recognizer, void *context) {
  APP_LOG(APP_LOG_LEVEL_DEBUG, i18n.multi_pressed_select);
  watch_sends_alert(ALERT_FALL);
  update_ticker(i18n.alert_fall);
}

/**
 * called when select btn pressed
 */
static void select_single_click_handler(ClickRecognizerRef recognizer, void *context) {
  APP_LOG(APP_LOG_LEVEL_DEBUG, i18n.pressed_select);
  watch_sends_text(i18n.pressed_select);
}

/**
 * called when select btn pressed multiple times
 */
static void select_multi_click_handler(ClickRecognizerRef recognizer, void *context) {
  APP_LOG(APP_LOG_LEVEL_DEBUG, i18n.multi_pressed_select);
  watch_sends_alert(ALERT_NOMOVE);
  update_ticker(i18n.alert_nomove);
}

/**
 * called when select btn pressed
 */
static void down_single_click_handler(ClickRecognizerRef recognizer, void *context) {
  APP_LOG(APP_LOG_LEVEL_DEBUG, i18n.pressed_down);
  watch_sends_text(i18n.pressed_down);
}

/**
 * called when down btn pressed multiple times
 */
static void down_multi_click_handler(ClickRecognizerRef recognizer, void *context) {
  APP_LOG(APP_LOG_LEVEL_DEBUG, i18n.multi_pressed_select);
  watch_sends_alert(ALERT_HEALTH);
  update_ticker(i18n.alert_emergency);
}

/**
 * click handler subscriptions
 */
void click_config_provider(void *context) {
  window_single_click_subscribe(BUTTON_ID_BACK, back_single_click_handler);
  //window_single_click_subscribe(BUTTON_ID_UP, up_single_click_handler);
  window_single_click_subscribe(BUTTON_ID_SELECT, select_single_click_handler);
  //window_single_click_subscribe(BUTTON_ID_DOWN, down_single_click_handler);

  window_multi_click_subscribe(BUTTON_ID_BACK, 2, 10, 0, true, back_multi_click_handler);
  window_multi_click_subscribe(BUTTON_ID_UP, 2, 10, 0, true, up_multi_click_handler);
  window_multi_click_subscribe(BUTTON_ID_SELECT, 2, 10, 0, true, select_multi_click_handler);
  window_multi_click_subscribe(BUTTON_ID_DOWN, 2, 10, 0, true, down_multi_click_handler);
}

/**
 * send a yes
 */
static void answer_yes_click_handler(ClickRecognizerRef recognizer, void *context) {
  //APP_LOG(APP_LOG_LEVEL_DEBUG, "answer_yes_click_handler called");
  watch_sends_text(i18n.answer_yes);
  update_ticker(i18n.thank_you);
}

/**
 * send a no
 */
static void answer_no_click_handler(ClickRecognizerRef recognizer, void *context) {
  //APP_LOG(APP_LOG_LEVEL_DEBUG, "answer_no_click_handler called");
  watch_sends_text(i18n.answer_no);
  update_ticker(i18n.relax);
}

/**
 * click handler for answers_layer
 */
void answers_layer_click_config_provider(void *context) {
  window_single_click_subscribe(BUTTON_ID_UP, (ClickHandler) answer_yes_click_handler);
  window_single_click_subscribe(BUTTON_ID_DOWN, (ClickHandler) answer_no_click_handler);
}

/**
 *
 */
static void page0_update_proc(Layer *layer, GContext *ctx) {
  //APP_LOG(APP_LOG_LEVEL_DEBUG, "page0_update_proc called");
}


/**
 *
 */
void update_status(const char *text) {
  snprintf(current_status, 100, "%s", text);
  text_layer_set_text(timer_layer, current_status);
}


/**
 *
 */
void update_ticker(const char *text) {
  snprintf(current_ticker, 40, "%s", text);
  APP_LOG(APP_LOG_LEVEL_DEBUG, "current_ticker: %s", current_ticker);

  layer_set_hidden(question_layer, 1);
  layer_set_hidden((Layer*) ticker_layer, 0);

  action_bar_layer_remove_from_window(answers_layer);

  window_set_click_config_provider(window, click_config_provider);

  text_layer_set_text(ticker_layer, current_ticker);
}

/**
 *
 */
void update_question(const char *text) {
  snprintf(current_question, 40, "%s", text);
  APP_LOG(APP_LOG_LEVEL_DEBUG, "current_question: %s", current_question);

  layer_set_hidden(question_layer, 0);
  layer_set_hidden((Layer*) ticker_layer, 1);

  action_bar_layer_add_to_window(answers_layer, window);
  layer_mark_dirty(question_layer);
}

/**
 *
 */
static void question_layer_update_proc(Layer *layer, GContext *ctx) {
  //APP_LOG(APP_LOG_LEVEL_DEBUG, "question_layer_update_proc called");

  const GRect layer_bounds = layer_get_bounds(layer);
  int total_width = 0;

  GSize size = graphics_text_layout_get_content_size(
    current_question, font_big, layer_bounds, GTextOverflowModeWordWrap, GTextAlignmentCenter);

  total_width += size.w;

  const int x_margin = (layer_bounds.size.w - total_width) / 2;
  const int y_margin = PBL_IF_RECT_ELSE(10, 2);
  const GRect rect = grect_inset(layer_bounds, GEdgeInsets(y_margin, 25, 0, 0));

  graphics_context_set_text_color(ctx, DEFAULT_QUESTION_TEXT_COLOR);
  graphics_context_set_fill_color(ctx, DEFAULT_QUESTION_FILL_COLOR);

  graphics_draw_text(ctx, current_question, font_big, rect,
                     GTextOverflowModeWordWrap, GTextAlignmentCenter, NULL);
}

/**
 *
 */
void window_load(Window *window) {
  font_small = fonts_get_system_font(FONT_KEY_GOTHIC_18);
  font_medium = fonts_get_system_font(FONT_KEY_GOTHIC_24_BOLD);
  font_big = fonts_get_system_font(FONT_KEY_BITHAM_30_BLACK);

  current_ticker = (char *) malloc(40);
  current_question = (char *) malloc(40);
  current_status = (char *) malloc(40);
  timer_text = (char *) malloc(25);

  Layer *window_layer = window_get_root_layer(window);
  GRect bounds = layer_get_bounds(window_layer);

  page0_layer = layer_create(bounds);

  header_frame = GRect(0, 0, bounds.size.w, 20);
  header_layer = text_layer_create(header_frame);
  text_layer_set_font(header_layer, font_small);
  text_layer_set_text_alignment(header_layer, GTextAlignmentCenter);
  text_layer_set_text(header_layer, i18n.title);

  // question layer with answers menu
  question_start_frame = GRect(0, 22, bounds.size.w, 124);
  question_layer = layer_create(question_start_frame);

  answers_layer = action_bar_layer_create();
  action_bar_layer_set_click_config_provider(answers_layer, answers_layer_click_config_provider);
  const GBitmap *icon_thumbs_up = gbitmap_create_with_resource(RESOURCE_ID_THUMBS_UP);
  const GBitmap *icon_thumbs_down = gbitmap_create_with_resource(RESOURCE_ID_THUMBS_DOWN);
  action_bar_layer_set_icon(answers_layer, BUTTON_ID_UP, icon_thumbs_up);
  action_bar_layer_set_icon(answers_layer, BUTTON_ID_DOWN, icon_thumbs_down);
  action_bar_layer_set_background_color(answers_layer, DEFAULT_QUESTION_TEXT_COLOR);

  // static text layer
  ticker_start_frame = GRect(0, 22, bounds.size.w, 124);
  ticker_layer = text_layer_create(ticker_start_frame);
  text_layer_set_font(ticker_layer, font_big);
  text_layer_set_text_alignment(ticker_layer, GTextAlignmentCenter);
  text_layer_set_overflow_mode(ticker_layer, GTextOverflowModeWordWrap);
  text_layer_set_text(ticker_layer, i18n.idle);

  timer_frame = GRect(0, 148, bounds.size.w, 20);
  timer_layer = text_layer_create(timer_frame);
  text_layer_set_font(timer_layer, font_small);
  text_layer_set_text_alignment(timer_layer, GTextAlignmentCenter);
  update_status(i18n.idle);

  // Set all update (redraw) proc for the layers
  layer_set_update_proc(page0_layer, page0_update_proc);
  layer_set_update_proc(question_layer, question_layer_update_proc);

  layer_add_child(page0_layer, text_layer_get_layer(header_layer));
  layer_add_child(page0_layer, question_layer);
  layer_add_child(page0_layer, text_layer_get_layer(ticker_layer));
  layer_add_child(page0_layer, text_layer_get_layer(timer_layer));

  // Add all layers to parent window
  layer_add_child(window_layer, page0_layer);
}

/**
 *
 */
void window_unload(Window *window) {
  destroy();
}

/**
 *
 */
void window_push(void) {
  window = window_create();

  window_set_click_config_provider(window, click_config_provider);

  window_set_window_handlers(window, (WindowHandlers) {
    .load = window_load,
    .unload = window_unload,
  });

  window_set_background_color(window, DEFAULT_BG_COLOR);
  window_stack_push(window, true);
}

/**
 *
 */
void window_redraw() {
  APP_LOG(APP_LOG_LEVEL_DEBUG, "window_redraw called");
  layer_mark_dirty(page0_layer);
}

/**
 *
 */
void destroy(void) {
  free(current_ticker);
  free(current_question);
  free(current_status);

  text_layer_destroy(header_layer);
  text_layer_destroy(ticker_layer);
  text_layer_destroy(timer_layer);
  action_bar_layer_destroy(answers_layer);
  layer_destroy(question_layer);
  layer_destroy(page0_layer);

  window_destroy(window);
}


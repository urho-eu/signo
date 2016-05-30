#pragma once

/**
 *
 */
typedef struct default_i18n {
  char *title;
  char *pressed_back;
  char *pressed_up;
  char *pressed_select;
  char *pressed_down;
  char *multi_pressed_back;
  char *multi_pressed_up;
  char *multi_pressed_select;
  char *multi_pressed_down;
  char *idle;
  char *login;
  char *started;
  char *stopped;
  char *finished;
  char *measuring_starts;
  char *measuring_ends;
  char *prefix_countdown;
  char *sampling_countdown;
  char *stopped_by_user;
  char *data_save_ok;
  char *data_save_failed;
  char *alert_emergency;
  char *alert_fall;
  char *alert_nomove;
  char *answer_yes;
  char *answer_no;
  char *thank_you;
  char *relax;
} __attribute__((__packed__)) default_i18n;

default_i18n i18n;

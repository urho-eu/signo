#include "util.h"

static GFont font_small, font_big, font_medium;

struct tm* get_tm() {
  time_t _t = time(NULL);
  return localtime(&_t);
}

GFont get_font(FontSize size) {
  switch(size) {
    case FontSizeSmall:  return font_small;
    case FontSizeMedium: return font_medium;
    case FontSizeLarge:  return font_big;
    default: return font_small;
  }
}

/**
 * Returns true if the submitted str ends with ?
 */
int is_question(const char *str)
{
  return (str && *str && str[strlen(str) - 1] == '?') ? 1 : 0;
}

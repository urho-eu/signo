package eu.urho.signo;

import android.content.Context;
import android.widget.TextView;

/**
 * Created by sopi on 5/13/16.
 */
public class AccRowValue extends TextView {

  private String value = "";

  public AccRowValue(Context context)
  {
    super(context);
  }

  public AccRowValue(Context context, Number number, int textColor, int bgColor, int alignment) {
    super(context);
    this.init(number.toString(), textColor, bgColor, alignment);
  }

  public AccRowValue(Context context, CharSequence text, int textColor, int bgColor, int alignment) {
    super(context);
    this.init(text, textColor, bgColor, alignment);
  }

  /**
   *
   * @param text
   * @param textColor
   * @param bgColor
   * @param alignment
   */
  private void init(CharSequence text, int textColor, int bgColor, int alignment) {
    this.value = text.toString();
    this.setText(text);
    this.setTextColor(textColor);
    this.setBackgroundColor(bgColor);

    if (alignment == 0) alignment = TEXT_ALIGNMENT_CENTER;
    this.setTextAlignment(alignment);

    int p = getResources().getDimensionPixelSize(R.dimen.value_pad);
    this.setPadding(p, p, p, p);
  }

  /**
   * Returns the value string set with setText()
   * @return value @link String
   */
  public String getValue() {
    return this.value;
  }
}

package eu.urho.signo;

import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.ColorFilter;
import android.graphics.Paint;
import android.graphics.PixelFormat;
import android.graphics.Rect;
import android.graphics.drawable.Drawable;
import android.util.Log;
import android.view.View;
import android.view.ViewOverlay;

/**
 * Created by sopi on 5/18/16.
 */
class Counter extends Drawable implements Cloneable {

  private Paint paintFill;
  private Paint paintText;
  private static final double SQRT_2 = Math.sqrt(2);
  private final Rect textBounds;
  private int width = 50;
  private int textSize;
  private int textColor = Color.WHITE;
  private String text = "Test";
  private int bgColor = Color.GRAY;
  private static View target;

  public Counter(String text, int textColor, int bgColor) {
    initPaintFill();
    initPaintText();
    textBounds = new Rect();
    setText(text);
    setBgColor(bgColor);
    setTextColor(textColor);
  }

  /**
   * Shows itself over the given target
   */
  public void show(View target) {
    setTarget(target);
    final ViewOverlay overlay = target.getOverlay();
    //this.setBounds(target.getWidth() / 2, 0, target.getWidth(), target.getHeight() / 2);

    try {
      final Counter cnt = (Counter) this.clone();

      target.post(new Runnable() {
        @Override
        public void run() {
          Log.d("Counter", "so what 1:" + this.toString());

          overlay.add(cnt);
          Log.d("Counter", "so what 2");
        }
      });
    } catch (CloneNotSupportedException e) {
      e.printStackTrace();
    }
  }

  /**
   * Hides itself over the given target
   */
  public void hide() {
    if (target != null) {
      target.getOverlay().remove(this);
    }
  }

  private void setText(String newText) {
    text = newText;
  }

  private void setTextColor(int color) {
    textColor = color;
  }

  private void setBgColor(int color) {
    bgColor = color;
  }

  private void setTarget(View view) {
    target = view;
  }

  private void initPaintFill() {
    paintFill = new Paint(Paint.ANTI_ALIAS_FLAG);
    paintFill.setStyle(Paint.Style.FILL);
    paintFill.setColor(bgColor);
  }

  private void initPaintText() {
    paintText = new Paint(Paint.ANTI_ALIAS_FLAG);
    paintText.setStyle(Paint.Style.FILL);
    paintText.setColor(textColor);
    paintText.setTextSize(textSize);
    //paintText.setShadowLayer(4.0f, 2.0f, 2.0f, Color.BLACK);
  }

  @Override
  public void draw(Canvas canvas) {
    Rect bounds = getBounds();

    if (bounds.isEmpty()) {
      bounds = canvas.getClipBounds();
    }
    float width = bounds.width();

    adaptTextSize((int) (width * 0.9), (int) (width * 0.9));

    float bannerHyp = (float) (width * SQRT_2);

    canvas.translate(0, bounds.centerY() - width);
    canvas.rotate(45, bounds.centerX(), bounds.centerY() - width);
    canvas.drawRect(bounds.left - bannerHyp, bounds.top, bounds.right + bannerHyp, bounds.top + width, paintFill);

    canvas.drawText(text, bounds.centerX() - textBounds.centerX(), width / 2 + textBounds.height() / 2, paintText);
  }

  private void adaptTextSize(float width, int height) {
    if (textSize > 0) {
      paintText.setTextSize(textSize);
      return;
    }
    int textSize = 10;
    int textHeight;
    int textWidth;
    boolean stop = false;
    while (! stop) {
      textSize = textSize++;
      paintText.setTextSize(textSize);
      paintText.getTextBounds(text, 0, text.length(), textBounds);

      textHeight = textBounds.height();
      textWidth = textBounds.width();

      stop = textHeight >= height || textWidth >= width;
    }
  }

  @Override
  public int getOpacity() {
    return PixelFormat.OPAQUE;
  }

  @Override
  public void setAlpha(int alpha) {
  }

  @Override
  public void setColorFilter(ColorFilter colorFilter) {
  }

}


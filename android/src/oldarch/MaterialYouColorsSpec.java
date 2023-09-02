package com.materialyoucolors;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.WritableMap;

abstract class MaterialYouColorsSpec extends ReactContextBaseJavaModule {
  MaterialYouColorsSpec(ReactApplicationContext context) {
    super(context);
  }

  public abstract WritableMap getColors();
}

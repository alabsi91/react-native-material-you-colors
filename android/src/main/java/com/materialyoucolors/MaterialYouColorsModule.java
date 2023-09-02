package com.materialyoucolors;

import android.annotation.TargetApi;
import android.os.Build;

import androidx.annotation.NonNull;
import androidx.core.content.ContextCompat;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;

import java.lang.reflect.Field;

public class MaterialYouColorsModule extends com.materialyoucolors.MaterialYouColorsSpec {
  public static final String NAME = "MaterialYouColors";

  private final ReactApplicationContext reactContext;

  MaterialYouColorsModule(ReactApplicationContext context) {
    super(context);
    reactContext = context;
  }

  @Override
  @NonNull
  public String getName() {
    return NAME;
  }


  @TargetApi(Build.VERSION_CODES.S)
  @ReactMethod(isBlockingSynchronousMethod = true)
  public WritableMap getColors() {
    String[] accents = {"system_accent1", "system_accent2", "system_accent3", "system_neutral1", "system_neutral2"};
    int[] shades = {0, 10, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000};

    WritableMap results = Arguments.createMap();

    for (String accent : accents) {
      WritableArray accentArray = Arguments.createArray();

      for (int shade : shades) {
        String colorName = accent + "_" + shade;
        int colorResourceId;
        try {
          Field field = android.R.color.class.getField(colorName);
          colorResourceId = field.getInt(null);
        } catch (NoSuchFieldException | IllegalAccessException e) {
          colorResourceId = 0;
        }
        String hexColor = colorToHex(colorResourceId);
        accentArray.pushString(hexColor);
      }

      results.putArray(accent, accentArray);
    }


    return results;
  }

  private int getColor(int id) {
    int version = Build.VERSION.SDK_INT;
    if (version >= 23) {
      return ContextCompat.getColor(reactContext, id);
    } else {
      // noinspection deprecation
      return reactContext.getResources().getColor(id);
    }
  }

  @NonNull
  private String colorToHex(int c) {
    if (c == 0) {
      return "#00000000";
    }
    int hex = getColor(c);

    return String.format("#%06X", 0xFFFFFF & hex);
  }
}

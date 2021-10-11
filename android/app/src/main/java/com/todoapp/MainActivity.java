package com.todoapp;

import com.facebook.react.ReactActivity;

import org.devio.rn.splashscreen.SplashScreen; //추가 for splash
import android.os.Bundle; //추가 for splash

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
   
  @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.show(this);
        super.onCreate(savedInstanceState);
    }
  @Override
  protected String getMainComponentName() {
    return "TodoApp";
  }
}

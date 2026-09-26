#!/bin/bash
set -e

ANDROID_JAR="/usr/lib/android-sdk/platforms/android-23/android.jar"
BUILD_DIR="/tmp/apk_build"

mkdir -p "$BUILD_DIR/src/com/exitlag/efootball/booster"
mkdir -p "$BUILD_DIR/res/drawable"
mkdir -p "$BUILD_DIR/res/values"
mkdir -p "$BUILD_DIR/bin"
mkdir -p "$BUILD_DIR/gen"

cat << "EOF" > "$BUILD_DIR/AndroidManifest.xml"
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.exitlag.efootball.booster"
    android:versionCode="1"
    android:versionName="1.0">

    <uses-sdk android:minSdkVersion="21" android:targetSdkVersion="33" />
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:label="@string/app_name"
        android:icon="@drawable/ic_launcher"
        android:theme="@android:style/Theme.NoTitleBar.Fullscreen"
        android:usesCleartextTraffic="true">
        <activity
            android:name=".MainActivity"
            android:label="@string/app_name"
            android:configChanges="orientation|screenSize|keyboardHidden"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
EOF

cat << "EOF" > "$BUILD_DIR/res/values/strings.xml"
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">ExitLag eFootball</string>
</resources>
EOF

if command -v rsvg-convert &> /dev/null; then
    rsvg-convert -w 192 -h 192 public/icon.svg -o "$BUILD_DIR/res/drawable/ic_launcher.png"
fi

cat << "EOF" > "$BUILD_DIR/src/com/exitlag/efootball/booster/MainActivity.java"
package com.exitlag.efootball.booster;

import android.app.Activity;
import android.os.Bundle;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebChromeClient;
import android.graphics.Color;
import android.view.KeyEvent;

public class MainActivity extends Activity {
    private WebView mWebView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,
                             WindowManager.LayoutParams.FLAG_FULLSCREEN);

        mWebView = new WebView(this);
        mWebView.setBackgroundColor(Color.parseColor("#070a10"));

        WebSettings settings = mWebView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);

        mWebView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                view.loadUrl(url);
                return true;
            }
        });

        mWebView.setWebChromeClient(new WebChromeClient());
        mWebView.loadUrl("https://ais-dev-sktvio7fxn4r52zzxfdtgc-91024381034.europe-west3.run.app");

        setContentView(mWebView);
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_BACK && mWebView.canGoBack()) {
            mWebView.goBack();
            return true;
        }
        return super.onKeyDown(keyCode, event);
    }
}
EOF

aapt package -f -m -J "$BUILD_DIR/gen" -M "$BUILD_DIR/AndroidManifest.xml" -S "$BUILD_DIR/res" -I "$ANDROID_JAR"
javac -source 1.8 -target 1.8 -cp "$ANDROID_JAR" -d "$BUILD_DIR/bin" "$BUILD_DIR/gen/com/exitlag/efootball/booster/R.java" "$BUILD_DIR/src/com/exitlag/efootball/booster/MainActivity.java"
/usr/bin/dalvik-exchange --dex --output="$BUILD_DIR/bin/classes.dex" "$BUILD_DIR/bin"
aapt package -f -M "$BUILD_DIR/AndroidManifest.xml" -S "$BUILD_DIR/res" -I "$ANDROID_JAR" -F "$BUILD_DIR/bin/app.unsigned.apk"
cd "$BUILD_DIR/bin"
aapt add app.unsigned.apk classes.dex
zipalign -f -p 4 app.unsigned.apk app.aligned.apk

if [ ! -f /tmp/release.keystore ]; then
    keytool -genkeypair -v -keystore /tmp/release.keystore -alias exitlag -keyalg RSA -keysize 2048 -validity 10000 -storepass exitlag123 -keypass exitlag123 -dname "CN=ExitLag, OU=Mobile, O=ExitLag, L=Tehran, ST=Tehran, C=IR"
fi

apksigner sign --ks /tmp/release.keystore --ks-pass pass:exitlag123 --ks-key-alias exitlag --key-pass pass:exitlag123 --out /tmp/ExitLag-eFootball-Booster.apk app.aligned.apk
apksigner verify /tmp/ExitLag-eFootball-Booster.apk

mkdir -p "$PWD/public"
cp /tmp/ExitLag-eFootball-Booster.apk "$PWD/public/ExitLag-eFootball-Booster.apk"
echo "APK build complete: public/ExitLag-eFootball-Booster.apk"

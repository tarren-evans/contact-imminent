package com.inactivestudios.contactimminent;

import android.os.Bundle;
import android.util.Log;

import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;

import com.getcapacitor.BridgeActivity;
import com.google.android.ump.ConsentInformation;
import com.google.android.ump.ConsentRequestParameters;
import com.google.android.ump.UserMessagingPlatform;

public class MainActivity extends BridgeActivity {

    private static final String TAG = "ContactImminentUMP";

    private ConsentInformation consentInformation;
    private static volatile boolean consentInitializationComplete = false;

    public static boolean isConsentInitializationComplete() {
        return consentInitializationComplete;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        registerPlugin(PrivacyChoicesPlugin.class);
        super.onCreate(savedInstanceState);
        enableImmersiveMode();
        initializeConsent();
    }

    @Override
    public void onResume() {
        super.onResume();
        enableImmersiveMode();
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);

        if (hasFocus) {
            enableImmersiveMode();
        }
    }

    private void initializeConsent() {
        consentInitializationComplete = false;

        ConsentRequestParameters params =
                new ConsentRequestParameters.Builder()
                        .build();

        consentInformation =
                UserMessagingPlatform.getConsentInformation(this);

        consentInformation.requestConsentInfoUpdate(
                this,
                params,
                () -> {
                    consentInitializationComplete = true;

                    Log.d(
                            TAG,
                            "Consent info updated. Status="
                                    + consentInformation.getConsentStatus()
                                    + ", canRequestAds="
                                    + consentInformation.canRequestAds()
                                    + ", privacyOptions="
                                    + consentInformation.getPrivacyOptionsRequirementStatus()
                    );

                    UserMessagingPlatform.loadAndShowConsentFormIfRequired(
                            this,
                            formError -> {
                                if (formError != null) {
                                    Log.e(
                                            TAG,
                                            "Consent form error: "
                                                    + formError.getErrorCode()
                                                    + " - "
                                                    + formError.getMessage()
                                    );
                                } else {
                                    Log.d(
                                            TAG,
                                            "Consent flow complete. Status="
                                                    + consentInformation.getConsentStatus()
                                                    + ", canRequestAds="
                                                    + consentInformation.canRequestAds()
                                                    + ", privacyOptions="
                                                    + consentInformation.getPrivacyOptionsRequirementStatus()
                                    );
                                }

                                enableImmersiveMode();
                            }
                    );
                },
                requestConsentError -> {
                    consentInitializationComplete = true;

                    Log.e(
                            TAG,
                            "Consent info update failed: "
                                    + requestConsentError.getErrorCode()
                                    + " - "
                                    + requestConsentError.getMessage()
                    );
                }
        );
    }

    private void enableImmersiveMode() {
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);

        WindowInsetsControllerCompat controller =
                WindowCompat.getInsetsController(
                        getWindow(),
                        getWindow().getDecorView()
                );

        controller.hide(WindowInsetsCompat.Type.systemBars());

        controller.setSystemBarsBehavior(
                WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
        );
    }
}
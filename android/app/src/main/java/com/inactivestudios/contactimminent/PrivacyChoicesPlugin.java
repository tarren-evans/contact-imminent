package com.inactivestudios.contactimminent;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.google.android.ump.ConsentInformation;
import com.google.android.ump.UserMessagingPlatform;

@CapacitorPlugin(name = "PrivacyChoices")
public class PrivacyChoicesPlugin extends Plugin {

    @PluginMethod
    public void getStatus(PluginCall call) {
        ConsentInformation consentInformation =
                UserMessagingPlatform.getConsentInformation(getActivity());

        JSObject result = new JSObject();

        result.put(
                "initialized",
                MainActivity.isConsentInitializationComplete()
        );

        result.put(
                "required",
                consentInformation.getPrivacyOptionsRequirementStatus()
                        == ConsentInformation.PrivacyOptionsRequirementStatus.REQUIRED
        );

        result.put(
                "canRequestAds",
                consentInformation.canRequestAds()
        );

        call.resolve(result);
    }

    @PluginMethod
    public void show(PluginCall call) {
        getActivity().runOnUiThread(() ->
                UserMessagingPlatform.showPrivacyOptionsForm(
                        getActivity(),
                        formError -> {
                            if (formError != null) {
                                call.reject(
                                        "Privacy options error "
                                                + formError.getErrorCode()
                                                + ": "
                                                + formError.getMessage()
                                );
                                return;
                            }

                            call.resolve();
                        }
                )
        );
    }
}
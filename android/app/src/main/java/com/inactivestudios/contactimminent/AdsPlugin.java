package com.inactivestudios.contactimminent;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.google.android.gms.ads.AdError;
import com.google.android.gms.ads.AdRequest;
import com.google.android.gms.ads.FullScreenContentCallback;
import com.google.android.gms.ads.LoadAdError;
import com.google.android.gms.ads.interstitial.InterstitialAd;
import com.google.android.gms.ads.interstitial.InterstitialAdLoadCallback;
import com.google.android.ump.ConsentInformation;
import com.google.android.ump.UserMessagingPlatform;

@CapacitorPlugin(name = "Ads")
public class AdsPlugin extends Plugin {

    private static final String TEST_INTERSTITIAL_AD_UNIT_ID =
            "ca-app-pub-3940256099942544/1033173712";

    private InterstitialAd interstitialAd;
    private boolean loading = false;

    private boolean canRequestAds() {
        ConsentInformation consentInformation =
                UserMessagingPlatform.getConsentInformation(getActivity());

        return MainActivity.isConsentInitializationComplete()
                && consentInformation.canRequestAds();
    }

    @PluginMethod
    public void loadInterstitial(PluginCall call) {
        getActivity().runOnUiThread(() -> {
            if (!canRequestAds()) {
                JSObject result = new JSObject();
                result.put("ready", false);
                result.put("loading", false);
                result.put("consentRequired", true);
                call.resolve(result);
                return;
            }

            if (interstitialAd != null) {
                JSObject result = new JSObject();
                result.put("ready", true);
                result.put("loading", false);
                result.put("consentRequired", false);
                call.resolve(result);
                return;
            }

            if (loading) {
                JSObject result = new JSObject();
                result.put("ready", false);
                result.put("loading", true);
                result.put("consentRequired", false);
                call.resolve(result);
                return;
            }

            loading = true;

            AdRequest adRequest = new AdRequest.Builder().build();

            InterstitialAd.load(
                    getActivity(),
                    TEST_INTERSTITIAL_AD_UNIT_ID,
                    adRequest,
                    new InterstitialAdLoadCallback() {
                        @Override
                        public void onAdLoaded(InterstitialAd ad) {
                            loading = false;
                            interstitialAd = ad;

                            JSObject result = new JSObject();
                            result.put("ready", true);
                            result.put("loading", false);
                            result.put("consentRequired", false);
                            call.resolve(result);
                        }

                        @Override
                        public void onAdFailedToLoad(LoadAdError loadAdError) {
                            loading = false;
                            interstitialAd = null;

                            call.reject(
                                    "Interstitial load failed "
                                            + loadAdError.getCode()
                                            + ": "
                                            + loadAdError.getMessage()
                            );
                        }
                    }
            );
        });
    }

    @PluginMethod
    public void getInterstitialStatus(PluginCall call) {
        JSObject result = new JSObject();
        result.put("ready", interstitialAd != null);
        result.put("loading", loading);
        result.put("canRequestAds", canRequestAds());
        call.resolve(result);
    }

    @PluginMethod
    public void showInterstitial(PluginCall call) {
        getActivity().runOnUiThread(() -> {
            if (!canRequestAds()) {
                call.reject("Ads cannot currently be requested.");
                return;
            }

            if (interstitialAd == null) {
                call.reject("Interstitial is not ready.");
                return;
            }

            InterstitialAd adToShow = interstitialAd;

            adToShow.setFullScreenContentCallback(
                    new FullScreenContentCallback() {
                        @Override
                        public void onAdShowedFullScreenContent() {
                            interstitialAd = null;
                        }

                        @Override
                        public void onAdDismissedFullScreenContent() {
                            call.resolve();
                        }

                        @Override
                        public void onAdFailedToShowFullScreenContent(
                                AdError adError
                        ) {
                            interstitialAd = null;

                            call.reject(
                                    "Interstitial show failed "
                                            + adError.getCode()
                                            + ": "
                                            + adError.getMessage()
                            );
                        }
                    }
            );

            adToShow.show(getActivity());
        });
    }
}

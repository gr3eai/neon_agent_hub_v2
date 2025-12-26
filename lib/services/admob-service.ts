import { Platform } from "react-native";
import mobileAds, {
  BannerAd,
  BannerAdSize,
  TestIds,
  InterstitialAd,
  AdEventType,
  RewardedAd,
  RewardedAdEventType,
} from "react-native-google-mobile-ads";

// AdMob IDs
export const ADMOB_CONFIG = {
  appId: "ca-app-pub-1071896040216647~4806889873",
  bannerAdUnitId: "ca-app-pub-1071896040216647/3493808200",
  // Use test IDs in development
  testBannerAdUnitId: Platform.select({
    ios: TestIds.BANNER,
    android: TestIds.BANNER,
  }) as string,
};

// Initialize AdMob
export async function initializeAdMob() {
  try {
    await mobileAds().initialize();
    console.log("AdMob initialized successfully");
    return true;
  } catch (error) {
    console.error("Failed to initialize AdMob:", error);
    return false;
  }
}

// Get Banner Ad Unit ID (use test ID in development)
export function getBannerAdUnitId(useTestAds: boolean = false) {
  if (useTestAds || __DEV__) {
    return ADMOB_CONFIG.testBannerAdUnitId;
  }
  return ADMOB_CONFIG.bannerAdUnitId;
}

// Create Interstitial Ad
export function createInterstitialAd(useTestAds: boolean = false) {
  const adUnitId = useTestAds || __DEV__ 
    ? TestIds.INTERSTITIAL 
    : ADMOB_CONFIG.bannerAdUnitId;

  const interstitial = InterstitialAd.createForAdRequest(adUnitId);
  
  interstitial.addAdEventListener(AdEventType.LOADED, () => {
    console.log("Interstitial ad loaded");
  });

  interstitial.addAdEventListener(AdEventType.ERROR, (error) => {
    console.error("Interstitial ad error:", error);
  });

  interstitial.load();
  
  return interstitial;
}

// Create Rewarded Ad
export function createRewardedAd(useTestAds: boolean = false) {
  const adUnitId = useTestAds || __DEV__ 
    ? TestIds.REWARDED 
    : ADMOB_CONFIG.bannerAdUnitId;

  const rewarded = RewardedAd.createForAdRequest(adUnitId);
  
  rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
    console.log("Rewarded ad loaded");
  });

  rewarded.addAdEventListener(AdEventType.ERROR, (error) => {
    console.error("Rewarded ad error:", error);
  });

  rewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, (reward) => {
    console.log("User earned reward:", reward);
  });

  rewarded.load();
  
  return rewarded;
}

export { BannerAd, BannerAdSize };

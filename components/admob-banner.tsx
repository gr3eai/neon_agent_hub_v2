import { View, Platform } from "react-native";
import { BannerAd, BannerAdSize, getBannerAdUnitId } from "@/lib/services/admob-service";

interface AdMobBannerProps {
  useTestAds?: boolean;
}

export function AdMobBanner({ useTestAds = false }: AdMobBannerProps) {
  // Don't show ads on web
  if (Platform.OS === "web") {
    return null;
  }

  return (
    <View className="items-center py-2">
      <BannerAd
        unitId={getBannerAdUnitId(useTestAds)}
        size={BannerAdSize.BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: false,
        }}
      />
    </View>
  );
}

import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useChatStore } from "@/hooks/use-chat-store";
import { chatStore, type ApiKeys } from "@/lib/stores/chat-store";
import { AIService } from "@/lib/services/ai-service";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useState } from "react";

export default function SettingsScreen() {
  const { apiKeys } = useChatStore();
  const colors = useColors();
  const [keys, setKeys] = useState<ApiKeys>(apiKeys);
  const [testing, setTesting] = useState<string | null>(null);

  const handleSave = async () => {
    await chatStore.saveApiKeys(keys);
    Alert.alert("تم الحفظ", "تم حفظ مفاتيح API بنجاح");
  };

  const handleTest = async (provider: keyof ApiKeys) => {
    const providerKey = keys[provider];
    if (!providerKey) {
      Alert.alert("خطأ", "يرجى إدخال مفتاح API أولاً");
      return;
    }

    setTesting(provider);
    const aiService = new AIService(keys);
    const success = await aiService.testConnection(provider as any);
    setTesting(null);

    if (success) {
      Alert.alert("نجح الاتصال", `تم الاتصال بـ ${getProviderName(provider)} بنجاح`);
    } else {
      Alert.alert("فشل الاتصال", `فشل الاتصال بـ ${getProviderName(provider)}`);
    }
  };

  const getProviderName = (provider: keyof ApiKeys) => {
    switch (provider) {
      case "deepseek":
        return "DeepSeek";
      case "groq":
        return "Groq";
      case "openai":
        return "OpenAI";
      case "together":
        return "Together";
      default:
        return provider;
    }
  };

  const providers: Array<{ key: keyof ApiKeys; name: string; url: string }> = [
    { key: "deepseek", name: "DeepSeek", url: "api.deepseek.com" },
    { key: "groq", name: "Groq", url: "console.groq.com" },
    { key: "openai", name: "OpenAI", url: "platform.openai.com" },
    { key: "together", name: "Together", url: "together.ai" },
  ];

  return (
    <ScreenContainer>
      <ScrollView className="flex-1 p-4">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-foreground mb-2">الإعدادات</Text>
          <Text className="text-base text-muted">إدارة مفاتيح API والإعدادات</Text>
        </View>

        {/* API Keys Section */}
        <View className="mb-6">
          <Text className="text-xl font-bold text-foreground mb-4">مفاتيح API</Text>

          {providers.map((provider) => (
            <View key={provider.key} className="mb-6">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-lg font-semibold text-foreground">{provider.name}</Text>
                <TouchableOpacity
                  onPress={() => handleTest(provider.key)}
                  disabled={testing === provider.key}
                  className="px-4 py-2 rounded-full bg-surface border border-border active:opacity-70"
                >
                  {testing === provider.key ? (
                    <ActivityIndicator size="small" color={colors.primary} />
                  ) : (
                    <Text className="text-sm font-medium" style={{ color: colors.primary }}>
                      اختبار
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
              <Text className="text-sm text-muted mb-2">{provider.url}</Text>
              <TextInput
                className="bg-surface rounded-2xl px-4 py-3 text-foreground border border-border"
                placeholder={`أدخل مفتاح ${provider.name}`}
                placeholderTextColor={colors.muted}
                value={keys[provider.key]}
                onChangeText={(text) => setKeys({ ...keys, [provider.key]: text })}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          ))}
        </View>

        {/* Save Button */}
        <TouchableOpacity
          onPress={handleSave}
          style={{ backgroundColor: colors.primary }}
          className="rounded-2xl py-4 items-center active:opacity-80 mb-6"
        >
          <Text className="text-lg font-bold" style={{ color: "#000" }}>
            حفظ الإعدادات
          </Text>
        </TouchableOpacity>

        {/* Info Section */}
        <View className="bg-surface rounded-2xl p-4 border border-border mb-6">
          <Text className="text-base font-semibold text-foreground mb-2">
            كيفية الحصول على مفاتيح API
          </Text>
          <Text className="text-sm text-muted leading-relaxed">
            1. قم بزيارة موقع المزود{"\n"}
            2. أنشئ حساب أو سجل الدخول{"\n"}
            3. انتقل إلى قسم API Keys{"\n"}
            4. أنشئ مفتاح جديد وانسخه{"\n"}
            5. الصقه في الحقل المناسب أعلاه
          </Text>
        </View>

        {/* App Info */}
        <View className="items-center py-6">
          <Text className="text-lg font-bold text-foreground mb-2">Neon Agent Hub V2</Text>
          <Text className="text-sm text-muted">الإصدار 1.0.0</Text>
          <Text className="text-sm text-muted mt-2">تم التطوير بواسطة Neon Agent Hub Team</Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

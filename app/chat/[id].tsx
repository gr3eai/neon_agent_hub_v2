import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useChatStore } from "@/hooks/use-chat-store";
import { chatStore } from "@/lib/stores/chat-store";
import { AIService } from "@/lib/services/ai-service";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useLocalSearchParams, router } from "expo-router";
import { useState, useRef, useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { chats, apiKeys, isLoading } = useChatStore();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [inputText, setInputText] = useState("");
  const flatListRef = useRef<FlatList>(null);

  const chat = chats.find((c) => c.id === id);

  useEffect(() => {
    if (chat) {
      chatStore.setCurrentChat(chat.id);
    }
  }, [chat]);

  if (!chat) {
    return (
      <ScreenContainer>
        <View className="flex-1 items-center justify-center">
          <Text className="text-lg text-muted">المحادثة غير موجودة</Text>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ backgroundColor: colors.primary }}
            className="mt-4 px-6 py-3 rounded-full"
          >
            <Text className="font-bold" style={{ color: "#000" }}>
              العودة
            </Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    );
  }

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const message = inputText.trim();
    setInputText("");

    // Add user message
    chatStore.addMessage(chat.id, {
      role: "user",
      content: message,
    });

    // Scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // Send to AI
    chatStore.setLoading(true);
    const aiService = new AIService(apiKeys);
    const response = await aiService.sendMessage(chat.provider, message);
    chatStore.setLoading(false);

    if (response.error) {
      chatStore.addMessage(chat.id, {
        role: "assistant",
        content: `خطأ: ${response.error}`,
      });
    } else {
      chatStore.addMessage(chat.id, {
        role: "assistant",
        content: response.content,
      });
    }

    // Scroll to bottom again
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const getProviderName = (provider: string) => {
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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      <ScreenContainer edges={["top", "left", "right"]}>
        <View className="flex-1">
          {/* Header */}
          <View className="flex-row items-center justify-between p-4 border-b border-border">
            <View className="flex-row items-center flex-1">
              <TouchableOpacity onPress={() => router.back()} className="mr-3">
                <IconSymbol name="chevron.left" size={24} color={colors.foreground} />
              </TouchableOpacity>
              <View className="flex-1">
                <Text className="text-lg font-bold text-foreground" numberOfLines={1}>
                  {chat.title}
                </Text>
                <Text className="text-sm text-muted">{getProviderName(chat.provider)}</Text>
              </View>
            </View>
          </View>

          {/* Messages */}
          <FlatList
            ref={flatListRef}
            data={chat.messages}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 16, paddingBottom: 8 }}
            renderItem={({ item }) => (
              <View
                className={`mb-4 ${item.role === "user" ? "items-end" : "items-start"}`}
              >
                <View
                  className={`max-w-[80%] rounded-2xl p-4 ${
                    item.role === "user"
                      ? "bg-primary"
                      : "bg-surface border border-border"
                  }`}
                  style={
                    item.role === "user"
                      ? { backgroundColor: colors.primary }
                      : undefined
                  }
                >
                  <Text
                    className={`text-base ${
                      item.role === "user" ? "text-black" : "text-foreground"
                    }`}
                  >
                    {item.content}
                  </Text>
                </View>
                <Text className="text-xs text-muted mt-1">
                  {new Date(item.timestamp).toLocaleTimeString("ar-SA", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </View>
            )}
            ListEmptyComponent={
              <View className="flex-1 items-center justify-center py-20">
                <Text className="text-lg text-muted text-center">
                  ابدأ المحادثة بإرسال رسالة
                </Text>
              </View>
            }
            showsVerticalScrollIndicator={false}
          />

          {/* Loading Indicator */}
          {isLoading && (
            <View className="items-start px-4 pb-2">
              <View className="bg-surface rounded-2xl p-4 border border-border">
                <ActivityIndicator size="small" color={colors.primary} />
              </View>
            </View>
          )}

          {/* Input */}
          <View
            className="flex-row items-center p-4 border-t border-border bg-background"
            style={{ paddingBottom: Math.max(insets.bottom, 16) }}
          >
            <View className="flex-1 flex-row items-center bg-surface rounded-2xl px-4 py-2 border border-border">
              <TextInput
                className="flex-1 text-foreground text-base"
                placeholder="اكتب رسالتك..."
                placeholderTextColor={colors.muted}
                value={inputText}
                onChangeText={setInputText}
                multiline
                maxLength={2000}
                returnKeyType="send"
                onSubmitEditing={handleSend}
                editable={!isLoading}
              />
            </View>
            <TouchableOpacity
              onPress={handleSend}
              disabled={!inputText.trim() || isLoading}
              style={{
                backgroundColor: inputText.trim() && !isLoading ? colors.primary : colors.muted,
              }}
              className="w-12 h-12 rounded-full items-center justify-center mr-3"
            >
              <IconSymbol name="paperplane.fill" size={20} color="#000" />
            </TouchableOpacity>
          </View>
        </View>
      </ScreenContainer>
    </KeyboardAvoidingView>
  );
}

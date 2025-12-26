import { View, Text, FlatList, TouchableOpacity, TextInput, Alert } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useChatStore } from "@/hooks/use-chat-store";
import { chatStore, type Provider } from "@/lib/stores/chat-store";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { router } from "expo-router";
import { useState } from "react";

export default function HomeScreen() {
  const { chats } = useChatStore();
  const colors = useColors();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredChats = chats.filter((chat) =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateChat = () => {
    Alert.alert(
      "اختر المزود",
      "اختر مزود الذكاء الاصطناعي",
      [
        {
          text: "DeepSeek",
          onPress: () => createNewChat("deepseek"),
        },
        {
          text: "Groq",
          onPress: () => createNewChat("groq"),
        },
        {
          text: "OpenAI",
          onPress: () => createNewChat("openai"),
        },
        {
          text: "Together",
          onPress: () => createNewChat("together"),
        },
        {
          text: "إلغاء",
          style: "cancel",
        },
      ]
    );
  };

  const createNewChat = (provider: Provider) => {
    const chatId = chatStore.createChat(provider);
    router.push(`/chat/${chatId}`);
  };

  const handleDeleteChat = (chatId: string) => {
    Alert.alert(
      "حذف المحادثة",
      "هل أنت متأكد من حذف هذه المحادثة؟",
      [
        {
          text: "إلغاء",
          style: "cancel",
        },
        {
          text: "حذف",
          style: "destructive",
          onPress: () => chatStore.deleteChat(chatId),
        },
      ]
    );
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "اليوم";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "أمس";
    } else {
      return date.toLocaleDateString("ar-SA", { month: "short", day: "numeric" });
    }
  };

  const getProviderColor = (provider: Provider) => {
    switch (provider) {
      case "deepseek":
        return "#3B82F6";
      case "groq":
        return "#8B5CF6";
      case "openai":
        return "#10B981";
      case "together":
        return "#F59E0B";
      default:
        return colors.primary;
    }
  };

  return (
    <ScreenContainer>
      <View className="flex-1 p-4">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-foreground mb-2">Neon Agent Hub</Text>
          <Text className="text-base text-muted">إدارة المحادثات والوكلاء الذكية</Text>
        </View>

        {/* Search Bar */}
        <View className="mb-4">
          <View className="flex-row items-center bg-surface rounded-2xl px-4 py-3 border border-border">
            <IconSymbol name="magnifyingglass" size={20} color={colors.muted} />
            <TextInput
              className="flex-1 mr-3 text-foreground"
              placeholder="البحث في المحادثات..."
              placeholderTextColor={colors.muted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* New Chat Button */}
        <TouchableOpacity
          onPress={handleCreateChat}
          style={{ backgroundColor: colors.primary }}
          className="flex-row items-center justify-center rounded-2xl py-4 mb-4 active:opacity-80"
        >
          <IconSymbol name="plus" size={24} color="#000" />
          <Text className="text-lg font-bold mr-2" style={{ color: "#000" }}>
            محادثة جديدة
          </Text>
        </TouchableOpacity>

        {/* Chats List */}
        {filteredChats.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <Text className="text-lg text-muted text-center">
              {searchQuery ? "لا توجد نتائج" : "لا توجد محادثات\nابدأ محادثة جديدة"}
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredChats}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  chatStore.setCurrentChat(item.id);
                  router.push(`/chat/${item.id}`);
                }}
                onLongPress={() => handleDeleteChat(item.id)}
                className="bg-surface rounded-2xl p-4 mb-3 border border-border active:opacity-70"
              >
                <View className="flex-row items-center justify-between mb-2">
                  <View className="flex-row items-center flex-1">
                    <View
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: getProviderColor(item.provider) }}
                    />
                    <Text className="text-base font-semibold text-foreground flex-1" numberOfLines={1}>
                      {item.title}
                    </Text>
                  </View>
                  <Text className="text-sm text-muted">{formatDate(item.updatedAt)}</Text>
                </View>
                <Text className="text-sm text-muted" numberOfLines={2}>
                  {item.messages.length > 0
                    ? item.messages[item.messages.length - 1].content
                    : "لا توجد رسائل"}
                </Text>
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </ScreenContainer>
  );
}

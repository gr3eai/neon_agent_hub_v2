import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: "wrench.fill" | "gearshape.fill" | "house.fill";
  color: string;
}

const tools: Tool[] = [
  {
    id: "1",
    name: "تحليل النصوص",
    description: "تحليل وفهم النصوص باستخدام الذكاء الاصطناعي",
    icon: "wrench.fill",
    color: "#3B82F6",
  },
  {
    id: "2",
    name: "معالجة الصور",
    description: "تحليل ومعالجة الصور والتعرف على المحتوى",
    icon: "wrench.fill",
    color: "#8B5CF6",
  },
  {
    id: "3",
    name: "الترجمة",
    description: "ترجمة النصوص بين اللغات المختلفة",
    icon: "wrench.fill",
    color: "#10B981",
  },
  {
    id: "4",
    name: "التلخيص",
    description: "تلخيص النصوص الطويلة بشكل ذكي",
    icon: "wrench.fill",
    color: "#F59E0B",
  },
  {
    id: "5",
    name: "الإعدادات المتقدمة",
    description: "إعدادات متقدمة للتحكم في الوكلاء",
    icon: "gearshape.fill",
    color: "#EF4444",
  },
];

export default function ToolsScreen() {
  const colors = useColors();

  return (
    <ScreenContainer>
      <View className="flex-1 p-4">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-foreground mb-2">الأدوات</Text>
          <Text className="text-base text-muted">أدوات ومميزات إضافية</Text>
        </View>

        {/* Tools Grid */}
        <FlatList
          data={tools}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{ gap: 12 }}
          contentContainerStyle={{ gap: 12 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="flex-1 bg-surface rounded-2xl p-6 border border-border active:opacity-70"
              style={{ minHeight: 160 }}
            >
              <View
                className="w-14 h-14 rounded-2xl items-center justify-center mb-4"
                style={{ backgroundColor: item.color + "20" }}
              >
                <IconSymbol name={item.icon} size={28} color={item.color} />
              </View>
              <Text className="text-lg font-bold text-foreground mb-2">{item.name}</Text>
              <Text className="text-sm text-muted">{item.description}</Text>
            </TouchableOpacity>
          )}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </ScreenContainer>
  );
}

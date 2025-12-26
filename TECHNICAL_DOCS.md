# الوثائق الفنية - Neon Agent Hub V2

## نظرة عامة

تطبيق موبايل متقدم لإدارة المحادثات مع وكلاء الذكاء الاصطناعي المتعددين، مبني باستخدام React Native و Expo مع دعم كامل لـ TypeScript و NativeWind.

## البنية التقنية

### التقنيات الأساسية

| التقنية | الإصدار | الاستخدام |
|---------|---------|-----------|
| React Native | 0.81.5 | إطار العمل الأساسي |
| Expo SDK | 54.0.29 | منصة التطوير والبناء |
| TypeScript | 5.9.3 | لغة البرمجة |
| Expo Router | 6.0.19 | التنقل بين الشاشات |
| NativeWind | 4.2.1 | Tailwind CSS للموبايل |
| AsyncStorage | 2.2.0 | التخزين المحلي |
| Google Mobile Ads | Latest | عرض الإعلانات |

### معمارية التطبيق

التطبيق يتبع معمارية **Component-Based** مع فصل واضح بين:

1. **Presentation Layer** (الشاشات والمكونات)
2. **Business Logic Layer** (الخدمات والمتاجر)
3. **Data Layer** (التخزين المحلي)

```
┌─────────────────────────────────────┐
│      Presentation Layer             │
│  (Screens & Components)             │
├─────────────────────────────────────┤
│      Business Logic Layer           │
│  (Services & Stores)                │
├─────────────────────────────────────┤
│         Data Layer                  │
│  (AsyncStorage)                     │
└─────────────────────────────────────┘
```

## إدارة الحالة (State Management)

### نمط Vanilla Store

التطبيق يستخدم نمطاً بسيطاً لإدارة الحالة بدون مكتبات خارجية ثقيلة:

```typescript
// lib/stores/chat-store.ts

interface ChatState {
  chats: Chat[];
  currentChatId: string | null;
  apiKeys: ApiKeys;
  isLoading: boolean;
}

let state: ChatState = { /* initial state */ };
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

export const chatStore = {
  getState: () => state,
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  // ... actions
};
```

### استخدام في المكونات

```typescript
import { useSyncExternalStore } from "react";
import { chatStore } from "@/lib/stores/chat-store";

export function useChatStore() {
  return useSyncExternalStore(
    chatStore.subscribe,
    chatStore.getState,
    chatStore.getState
  );
}
```

## خدمة الذكاء الاصطناعي (AI Service)

### معمارية الخدمة

```typescript
export class AIService {
  private apiKeys: ApiKeys;

  constructor(apiKeys: ApiKeys) {
    this.apiKeys = apiKeys;
  }

  async sendMessage(provider: Provider, message: string): Promise<AIResponse> {
    switch (provider) {
      case "deepseek":
        return await this.sendToDeepSeek(message);
      case "groq":
        return await this.sendToGroq(message);
      case "openai":
        return await this.sendToOpenAI(message);
      case "together":
        return await this.sendToTogether(message);
    }
  }
}
```

### نقاط النهاية (API Endpoints)

| المزود | Endpoint | Model |
|--------|----------|-------|
| DeepSeek | `https://api.deepseek.com/v1/chat/completions` | deepseek-chat |
| Groq | `https://api.groq.com/openai/v1/chat/completions` | mixtral-8x7b-32768 |
| OpenAI | `https://api.openai.com/v1/chat/completions` | gpt-3.5-turbo |
| Together | `https://api.together.xyz/v1/chat/completions` | mistralai/Mixtral-8x7B-Instruct-v0.1 |

## تكامل AdMob

### التكوين

```typescript
// lib/services/admob-service.ts

export const ADMOB_CONFIG = {
  appId: "ca-app-pub-1071896040216647~4806889873",
  bannerAdUnitId: "ca-app-pub-1071896040216647/3493808200",
};
```

### التهيئة

```typescript
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
```

### مكون Banner Ad

```typescript
export function AdMobBanner({ useTestAds = false }: AdMobBannerProps) {
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
```

## التخزين المحلي

### استراتيجية التخزين

يستخدم التطبيق `AsyncStorage` لحفظ:

1. **المحادثات** (`@neon_agent_hub:chats`)
   - معرف المحادثة
   - العنوان
   - المزود
   - الرسائل
   - التواريخ

2. **مفاتيح API** (`@neon_agent_hub:api_keys`)
   - DeepSeek API Key
   - Groq API Key
   - OpenAI API Key
   - Together API Key

### مثال على الحفظ والتحميل

```typescript
// حفظ المحادثات
saveChats: async () => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state.chats));
  } catch (error) {
    console.error("Failed to save chats:", error);
  }
},

// تحميل المحادثات
loadChats: async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (data) {
      const chats = JSON.parse(data);
      state = { ...state, chats };
      emit();
    }
  } catch (error) {
    console.error("Failed to load chats:", error);
  }
}
```

## نظام الألوان والتصميم

### Palette

```javascript
// theme.config.js

const themeColors = {
  primary: { light: '#FFD700', dark: '#FFD700' },      // ذهبي
  background: { light: '#ffffff', dark: '#0a0a0a' },   // أبيض/أسود
  surface: { light: '#f5f5f5', dark: '#1a1a1a' },      // رمادي فاتح/داكن
  foreground: { light: '#11181C', dark: '#ECEDEE' },   // نص أساسي
  muted: { light: '#687076', dark: '#9BA1A6' },        // نص ثانوي
  border: { light: '#E5E7EB', dark: '#2a2a2a' },       // حدود
};
```

### استخدام NativeWind

```tsx
// مثال على استخدام Tailwind Classes
<View className="flex-1 bg-background p-4">
  <Text className="text-2xl font-bold text-foreground">
    عنوان
  </Text>
  <Text className="text-base text-muted">
    نص ثانوي
  </Text>
</View>
```

## التنقل (Navigation)

### بنية Expo Router

```
app/
├── (tabs)/
│   ├── _layout.tsx       # تخطيط التبويبات
│   ├── index.tsx         # الشاشة الرئيسية
│   ├── tools.tsx         # شاشة الأدوات
│   └── settings.tsx      # شاشة الإعدادات
├── chat/
│   └── [id].tsx          # شاشة المحادثة (Dynamic Route)
└── _layout.tsx           # تخطيط الجذر
```

### التنقل البرمجي

```typescript
import { router } from "expo-router";

// الانتقال إلى محادثة
router.push(`/chat/${chatId}`);

// العودة
router.back();
```

## الأداء والتحسينات

### استراتيجيات التحسين

1. **FlatList للقوائم الطويلة**
   ```typescript
   <FlatList
     data={chats}
     keyExtractor={(item) => item.id}
     renderItem={({ item }) => <ChatItem chat={item} />}
     showsVerticalScrollIndicator={false}
   />
   ```

2. **Memoization للمكونات الثقيلة**
   ```typescript
   const MemoizedChatItem = React.memo(ChatItem);
   ```

3. **Lazy Loading للصور**
   ```typescript
   <Image
     source={{ uri: imageUrl }}
     placeholder={blurhash}
     contentFit="cover"
   />
   ```

## الأمان

### حماية مفاتيح API

- يتم تخزين مفاتيح API في AsyncStorage (مشفرة على مستوى النظام)
- لا يتم إرسال المفاتيح إلى أي خادم خارجي
- يمكن للمستخدم حذف المفاتيح في أي وقت

### معالجة الأخطاء

```typescript
try {
  const response = await aiService.sendMessage(provider, message);
  if (response.error) {
    // معالجة الخطأ
    chatStore.addMessage(chatId, {
      role: "assistant",
      content: `خطأ: ${response.error}`,
    });
  }
} catch (error) {
  console.error("Unexpected error:", error);
}
```

## البناء والنشر

### بناء APK محلياً

```bash
# تثبيت EAS CLI
pnpm add -g eas-cli

# تسجيل الدخول
eas login

# بناء APK
eas build --platform android --profile preview --local
```

### تكوين EAS Build

```json
{
  "build": {
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

## الاختبار

### استراتيجية الاختبار

1. **Unit Tests** للخدمات والمتاجر
2. **Integration Tests** للتدفقات الرئيسية
3. **Manual Testing** على أجهزة حقيقية

### أمثلة على الاختبارات

```typescript
// test/chat-store.test.ts

describe("ChatStore", () => {
  it("should create a new chat", () => {
    const chatId = chatStore.createChat("deepseek");
    expect(chatId).toBeDefined();
    expect(chatStore.getState().chats).toHaveLength(1);
  });

  it("should add message to chat", () => {
    const chatId = chatStore.createChat("deepseek");
    chatStore.addMessage(chatId, {
      role: "user",
      content: "Hello",
    });
    const chat = chatStore.getState().chats.find(c => c.id === chatId);
    expect(chat?.messages).toHaveLength(1);
  });
});
```

## المساهمة في التطوير

### معايير الكود

1. **TypeScript Strict Mode** مفعّل
2. **ESLint** للتحقق من جودة الكود
3. **Prettier** لتنسيق الكود
4. **Conventional Commits** لرسائل الـ commits

### سير العمل

```bash
# إنشاء فرع جديد
git checkout -b feature/new-feature

# تطوير الميزة
# ...

# التحقق من الأخطاء
pnpm check

# تنسيق الكود
pnpm format

# Commit
git commit -m "feat: add new feature"

# Push
git push origin feature/new-feature

# فتح Pull Request
```

## الموارد والمراجع

- [React Native Documentation](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [NativeWind Documentation](https://www.nativewind.dev/)
- [Google Mobile Ads Documentation](https://docs.page/invertase/react-native-google-mobile-ads)
- [DeepSeek API](https://api.deepseek.com)
- [Groq API](https://console.groq.com)
- [OpenAI API](https://platform.openai.com)
- [Together API](https://together.ai)

## الدعم الفني

للحصول على الدعم الفني أو الإبلاغ عن مشاكل:

1. افتح Issue على [GitHub](https://github.com/gr3eai/neon_agent_hub_v2/issues)
2. تأكد من تضمين:
   - وصف المشكلة
   - خطوات إعادة الإنتاج
   - لقطات الشاشة (إن أمكن)
   - معلومات الجهاز ونظام التشغيل

---

**آخر تحديث**: ديسمبر 2025
**الإصدار**: 1.0.0

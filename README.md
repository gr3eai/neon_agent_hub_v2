# Neon Agent Hub V2

منصة ذكية متقدمة لإدارة الوكلاء والمحادثات مع دعم متعدد المزودين (DeepSeek, Groq, OpenAI, Together).

![App Icon](./assets/images/icon.png)

## المميزات الرئيسية

- **دعم متعدد المزودين**: تكامل سلس مع DeepSeek, Groq, OpenAI, و Together
- **إدارة الوكلاء**: إنشاء وتخصيص وكلاء ذكية متعددة
- **المحادثات الذكية**: واجهة محادثة حديثة وسهلة الاستخدام
- **التخزين المحلي**: حفظ المحادثات والبيانات محلياً باستخدام AsyncStorage
- **واجهة حديثة**: تصميم سيبراني حديث مع ألوان ذهبية وسوداء
- **تكامل AdMob**: عرض إعلانات Banner Ads في التطبيق

## التقنيات المستخدمة

- **React Native 0.81** مع **Expo SDK 54**
- **TypeScript 5.9**
- **Expo Router 6** للتنقل
- **NativeWind 4** (Tailwind CSS للموبايل)
- **AsyncStorage** للتخزين المحلي
- **Google Mobile Ads** لعرض الإعلانات

## متطلبات التشغيل

- **نظام التشغيل**: Android 8.0 أو أحدث / iOS 13.0 أو أحدث
- **الذاكرة**: 2GB على الأقل
- **المساحة**: 100MB مساحة خالية
- **الاتصال**: اتصال إنترنت مستقر

## التثبيت والتطوير

### المتطلبات

- Node.js 18+ و pnpm
- Expo CLI
- Android Studio (للأندرويد) أو Xcode (لـ iOS)

### خطوات التثبيت

```bash
# استنساخ المستودع
git clone https://github.com/gr3eai/neon_agent_hub_v2.git
cd neon_agent_hub_v2

# تثبيت المكتبات
pnpm install

# تشغيل التطبيق في وضع التطوير
pnpm dev

# أو تشغيل على الأندرويد
pnpm android

# أو تشغيل على iOS
pnpm ios
```

## بناء APK

### باستخدام EAS Build (محلياً)

```bash
# تثبيت EAS CLI
pnpm add -g eas-cli

# تسجيل الدخول إلى Expo
eas login

# بناء APK
eas build --platform android --profile preview --local
```

### باستخدام Expo Build

```bash
# بناء APK
expo build:android -t apk
```

## إعداد مفاتيح API

عند فتح التطبيق لأول مرة:

1. اذهب إلى **الإعدادات** ⚙️
2. أدخل مفاتيح API الخاصة بك:
   - **DeepSeek**: احصل على المفتاح من [api.deepseek.com](https://api.deepseek.com)
   - **Groq**: احصل على المفتاح من [console.groq.com](https://console.groq.com)
   - **OpenAI**: احصل على المفتاح من [platform.openai.com](https://platform.openai.com)
   - **Together**: احصل على المفتاح من [together.ai](https://together.ai)
3. اختبر الاتصال بكل مزود
4. احفظ الإعدادات

## تكوين AdMob

التطبيق مُعد مسبقاً مع معرفات AdMob التالية:

- **App ID**: `ca-app-pub-1071896040216647~4806889873`
- **Banner Ad Unit ID**: `ca-app-pub-1071896040216647/3493808200`

لتغيير معرفات AdMob، قم بتحديث الملفات التالية:

1. `lib/services/admob-service.ts` - تحديث `ADMOB_CONFIG`
2. `app.config.ts` - تحديث plugin `react-native-google-mobile-ads`

## بنية المشروع

```
neon_agent_hub_v2/
├── app/                           # شاشات التطبيق
│   ├── (tabs)/                   # شاشات التبويب الرئيسية
│   │   ├── index.tsx            # الشاشة الرئيسية
│   │   ├── tools.tsx            # شاشة الأدوات
│   │   └── settings.tsx         # شاشة الإعدادات
│   ├── chat/
│   │   └── [id].tsx             # شاشة المحادثة
│   └── _layout.tsx              # تخطيط الجذر
├── lib/
│   ├── services/                # الخدمات
│   │   ├── ai-service.ts       # خدمة الذكاء الاصطناعي
│   │   └── admob-service.ts    # خدمة AdMob
│   └── stores/                  # متاجر البيانات
│       └── chat-store.ts        # متجر المحادثات
├── components/                   # المكونات المشتركة
│   ├── screen-container.tsx    # حاوية الشاشة
│   ├── admob-banner.tsx        # مكون Banner Ad
│   └── ui/                      # مكونات UI
├── assets/                       # الصور والأيقونات
├── hooks/                        # React Hooks
├── theme.config.js              # تكوين الألوان
├── app.config.ts                # تكوين Expo
└── eas.json                     # تكوين EAS Build
```

## استخدام التطبيق

### بدء محادثة جديدة

1. من الشاشة الرئيسية، اضغط على زر "محادثة جديدة"
2. اختر المزود المفضل (DeepSeek, Groq, OpenAI, أو Together)
3. اكتب رسالتك في حقل الإدخال
4. اضغط على زر الإرسال
5. انتظر رد الوكيل
6. تُحفظ المحادثة تلقائياً

### إدارة المحادثات

- **حفظ محادثة**: يتم الحفظ تلقائياً
- **حذف محادثة**: اضغط مطولاً على المحادثة واختر حذف
- **البحث**: استخدم شريط البحث في الشاشة الرئيسية

### تبديل المزود

أثناء المحادثة، يمكنك إنشاء محادثة جديدة بمزود مختلف من الشاشة الرئيسية.

## استكشاف الأخطاء

### المشكلة: التطبيق لا يتصل بالإنترنت

**الحل:**
- تحقق من اتصالك بالإنترنت
- أعد تشغيل التطبيق
- امسح ذاكرة التطبيق من الإعدادات

### المشكلة: مفتاح API غير صحيح

**الحل:**
- تحقق من صحة المفتاح
- تأكد من أنك نسخت المفتاح كاملاً بدون مسافات
- اختبر الاتصال من شاشة الإعدادات

### المشكلة: الإعلانات لا تظهر

**الحل:**
- في وضع التطوير، يتم استخدام Test Ads تلقائياً
- تأكد من أن معرفات AdMob صحيحة
- تحقق من اتصالك بالإنترنت

## الميزات القادمة

- [ ] دعم الصور في المحادثات
- [ ] تحليل الملفات
- [ ] مزامنة البيانات السحابية
- [ ] دعم لغات إضافية
- [ ] وضع الوضع الليلي المحسّن
- [ ] إعلانات Interstitial و Rewarded

## الأوامر المتاحة

```bash
# تشغيل التطبيق في الوضع التطوير
pnpm dev

# بناء التطبيق
pnpm build

# التحقق من الأخطاء
pnpm check

# تنسيق الكود
pnpm format

# تشغيل الاختبارات
pnpm test

# تشغيل على الأندرويد
pnpm android

# تشغيل على iOS
pnpm ios
```

## الترخيص

هذا المشروع مرخص تحت رخصة MIT.

## الدعم والمساعدة

للإبلاغ عن الأخطاء أو طلب ميزات جديدة، يرجى فتح issue على GitHub.

## المساهمة

نرحب بالمساهمات! يرجى اتباع الخطوات التالية:

1. انسخ المستودع (Fork)
2. أنشئ فرع للميزة الجديدة (`git checkout -b feature/AmazingFeature`)
3. اعمل على التغييرات
4. اعمل commit للتغييرات (`git commit -m 'Add some AmazingFeature'`)
5. ادفع إلى الفرع (`git push origin feature/AmazingFeature`)
6. افتح Pull Request

---

**تم التطوير بواسطة**: Neon Agent Hub Team

**آخر تحديث**: ديسمبر 2025

**الإصدار**: 1.0.0

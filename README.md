# 🌾 تطبيق إدارة المزارع الذكية (Smart Farm Management System)

تطبيق شامل لإدارة المزارع والحقول والثروة الحيوانية مع تقنيات الذكاء الاصطناعي.

## ✨ الميزات الرئيسية

### 📊 لوحة التحكم
- نظرة عامة على المزرعة
- إحصائيات فورية
- الملخص المالي
- جدول الحصاد القادم
- حالة الطقس

### 🏡 إدارة المزارع والحقول
- عرض المزارع المسجلة
- إضافة حقول جديدة
- تتبع المساحات

### 👥 إدارة العمال
- قائمة العمال
- المسميات الوظيفية
- الرواتب اليومية
- أرقام التواصل

### 🐑 الثروة الحيوانية
- تتبع المجموعات الحيوانية
- تكاليف الخدمة اليومية
- كاميرات ذكية بالتعرف بالـ AI

### 🌾 حاسبة علف القصب
- حساب الاحتياجات اليومية والسنوية
- تحديد مساحة القصب المطلوبة
- حساب التكاليف

### 🔬 فحص الأمراض
- رفع صور النباتات
- تشخيص ذكي بالـ AI
- توصيات العلاج

### 💰 السجل المالي
- تتبع الدخل والمصروفات
- تحليل العمليات المالية
- تقارير مفصلة

## 🛠️ المكدس التقني

### Backend
- Node.js + Express + TypeScript
- PostgreSQL + Prisma ORM
- JWT Authentication
- Socket.io (Real-time)
- Claude API (AI)

### Frontend (Web)
- React + TypeScript
- Tailwind CSS
- Vite
- Chart.js / Recharts
- Axios

### Mobile (React Native)
- React Native + TypeScript
- NativeWind
- Expo
- Redux/Context API

## 📁 البنية

```
zarai_app/
├── backend/                 # API Server
├── frontend-web/            # Web Application
├── frontend-mobile/         # Mobile App
├── shared/                  # Shared Types & Utils
└── docs/                    # Documentation
```

## 🚀 البدء السريع

### تثبيت المتطلبات
```bash
# Node.js 18+ مطلوب
node --version
npm --version
```

### تثبيت الـ Backend
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### تثبيت الـ Frontend (Web)
```bash
cd frontend-web
npm install
npm run dev
```

### تثبيل الـ Frontend (Mobile)
```bash
cd frontend-mobile
npm install
npx expo start
```

## 📚 الملفات المهمة

- `backend/.env.example` - متغيرات البيئة
- `backend/prisma/schema.prisma` - قاعدة البيانات
- `docs/API.md` - توثيق الـ APIs
- `docs/DATABASE.md` - شرح البيانات

## 👨‍💻 المطور

**fahhd4king-cell** - Solo Developer

## 📝 الترخيص

MIT License

---

**آخر تحديث:** 2026-07-13

# 📖 دليل التطوير الشامل

## 1️⃣ البدء السريع

### المتطلبات
- Node.js 18+
- npm أو yarn
- PostgreSQL 12+
- VS Code (مفضل)

### التثبيت الأول

```bash
# 1. استنساخ المشروع
git clone https://github.com/fahhd4king-cell/zarai_app.git
cd zarai_app

# 2. تثبيت Backend
cd backend
npm install
cp .env.example .env
# عدّل .env بـ DATABASE_URL و JWT_SECRET

# 3. إنشاء قاعدة البيانات
npx prisma migrate dev --name init
npm run seed  # تعبئة البيانات التجريبية

# 4. تشغيل Backend
npm run dev
# سيعمل على http://localhost:3000

# 5. تثبيت Frontend (في نافذة جديدة)
cd ../frontend-web
npm install
npm run dev
# سيعمل على http://localhost:5173
```

---

## 2️⃣ هيكل المشروع

```
zarai_app/
├── backend/
│   ├── src/
│   │   ├── index.ts          # نقطة الدخول
│   │   ├── middleware/       # Middleware (auth, validation)
│   │   ├── routes/           # API Routes
│   │   ├── services/         # Business Logic (يتم إضافتها)
│   │   └── utils/            # Utility Functions (يتم إضافتها)
│   ├── prisma/
│   │   ├── schema.prisma     # Database Schema
│   │   └── seed.ts           # Initial Data
│   ├── package.json
│   └── tsconfig.json
│
├── frontend-web/
│   ├── src/
│   │   ├── components/       # Reusable UI Components
│   │   ├── pages/            # Page Components
│   │   ├── hooks/            # Custom Hooks (يتم إضافتها)
│   │   ├── utils/            # Utility Functions
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
│
├── frontend-mobile/
│   ├── src/
│   │   ├── screens/          # Mobile Screens
│   │   ├── components/       # Mobile Components
│   │   └── App.tsx
│   └── package.json
│
├── shared/                   # Shared Code
│   └── types/
│
└── docs/                     # Documentation
```

---

## 3️⃣ نقاط API الأساسية

### Auth
```
POST   /api/auth/register    - إنشاء حساب
POST   /api/auth/login       - تسجيل دخول
```

### Farms
```
GET    /api/farms            - الحصول على المزارع
GET    /api/farms/:id        - مزرعة محددة
POST   /api/farms            - إنشاء مزرعة
PUT    /api/farms/:id        - تحديث مزرعة
DELETE /api/farms/:id        - حذف مزرعة
```

### Crops
```
GET    /api/crops            - جميع المحاصيل
POST   /api/crops            - إضافة محصول
PATCH  /api/crops/:id/status - تحديث حالة
```

### Workers
```
GET    /api/workers          - جميع العمال
POST   /api/workers          - إضافة عامل
POST   /api/workers/:id/attendance - تسجيل الحضور
```

### Finance
```
GET    /api/finance/transactions    - المعاملات
POST   /api/finance/transactions    - إضافة معاملة
GET    /api/finance/report          - التقرير المالي
```

### Livestock
```
GET    /api/livestock        - الثروة الحيوانية
POST   /api/livestock        - إضافة مجموعة
POST   /api/livestock/:id/health - إضافة سجل صحي
```

### Disease (AI)
```
POST   /api/disease/diagnose - تشخيص المرض
GET    /api/disease/crop/:cropId - أمراض المحصول
```

### Forage
```
POST   /api/forage/calculate - حساب العلف
```

---

## 4️⃣ إضافة ميزة جديدة

### مثال: إضافة نقطة API لفحص التربة

#### خطوة 1: تحديث قاعدة البيانات
```typescript
// backend/prisma/schema.prisma
model SoilTest {
  id        String   @id @default(cuid())
  fieldId   String
  field     Field    @relation(fields: [fieldId], references: [id])
  nitrogen  Float
  phosphorus Float
  potassium Float
  pH        Float
  date      DateTime @default(now())
  notes     String?
  createdAt DateTime @default(now())

  @@map("soil_tests")
}
```

#### خطوة 2: إنشاء Migration
```bash
cd backend
npx prisma migrate dev --name add_soil_tests
```

#### خطوة 3: إنشاء API Route
```typescript
// backend/src/routes/soil.ts
import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

router.post('/test', authenticateToken, async (req, res) => {
  try {
    const { fieldId, nitrogen, phosphorus, potassium, pH, notes } = req.body;
    
    const test = await prisma.soilTest.create({
      data: {
        fieldId,
        nitrogen: parseFloat(nitrogen),
        phosphorus: parseFloat(phosphorus),
        potassium: parseFloat(potassium),
        pH: parseFloat(pH),
        notes,
      },
    });
    
    res.status(201).json(test);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
```

#### خطوة 4: تسجيل الـ Route
```typescript
// backend/src/index.ts
import soilRoutes from './routes/soil';
app.use('/api/soil', soilRoutes);
```

---

## 5️⃣ أفضل الممارسات

### ✅ Code Style
- استخدم TypeScript بقوة
- أضف JSDoc comments
- سمّ المتغيرات بوضوح

### ✅ Error Handling
```typescript
try {
  // do something
} catch (error: any) {
  console.error('Error:', error);
  res.status(500).json({ error: error.message });
}
```

### ✅ Authentication
```typescript
// دائماً تحقق من التوكن
router.get('/', authenticateToken, async (req, res) => {
  // protected route
});
```

### ✅ Validation
```typescript
if (!name || !email) {
  return res.status(400).json({ error: 'Required fields missing' });
}
```

---

## 6️⃣ نصائح للأداء

### ⚡ Backend
- استخدم Database Indexing
- Cache النتائج المتكررة
- تجنب N+1 Queries

### ⚡ Frontend
- استخدم React.memo للمكونات الثقيلة
- Lazy load الصفحات
- قلل حجم الـ Bundles

---

## 7️⃣ الاختبار

### Unit Tests
```bash
npm test
```

### Integration Tests
```bash
npm run test:integration
```

### API Testing (Postman)
انظر: docs/TESTING.md

---

## 8️⃣ Deployment

### Backend (Heroku/Railway)
```bash
git push heroku main
```

### Frontend (Vercel)
```bash
npm run build
vercel deploy
```

---

## 9️⃣ المشاكل الشائعة وحلولها

### ❌ CORS Error
✅ تحقق من allowedOrigins في backend

### ❌ Database Connection Error
✅ تأكد من DATABASE_URL الصحيح

### ❌ Token Expired
✅ طلب توكن جديد / تسجيل دخول مجدداً

### ❌ Port Already in Use
```bash
# قتل العملية
lsof -i :3000
kill -9 <PID>
```

---

## 🔟 الموارد المفيدة

- [Express Documentation](https://expressjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

**Happy Coding! 🚀**

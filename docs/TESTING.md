# 🧪 دليل الاختبار

## 1️⃣ اختبار Backend

### تشغيل الخادم
```bash
cd backend
npm install
npm run dev
```

### اختبار APIs باستخدام cURL أو Postman

#### تسجيل حساب جديد
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "محمد",
    "phone": "+966501234567"
  }'
```

#### تسجيل الدخول
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

#### إضافة مزرعة (استخدم التوكن من تسجيل الدخول)
```bash
curl -X POST http://localhost:3000/api/farms \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "مزرعة النخيل",
    "location": "الدمام",
    "area": 50
  }'
```

#### الحصول على المزارع
```bash
curl -X GET http://localhost:3000/api/farms \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### حساب احتياجات العلف
```bash
curl -X POST http://localhost:3000/api/forage/calculate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "sheepCount": 100,
    "dailyConsumption": 2,
    "forageProductivity": 15000,
    "foragePrice": 500
  }'
```

#### الحصول على التقرير المالي
```bash
curl -X GET http://localhost:3000/api/finance/report \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 2️⃣ اختبار Frontend (Web)

### تشغيل التطبيق
```bash
cd frontend-web
npm install
npm run dev
```

التطبيق يعمل على: http://localhost:5173

### خطوات الاختبار

1. **تسجيل حساب جديد**
   - اضغط على "إنشاء حساب"
   - ملء البيانات
   - تسجيل الدخول

2. **عرض لوحة التحكم**
   - يجب أن تظهر الإحصائيات
   - الرسوم البيانية
   - جدول الحصاد

3. **إضافة مزرعة**
   - انتقل إلى "المزارع والحقول"
   - اضغط "إضافة مزرعة"
   - ملء البيانات
   - حفظ

4. **استخدام حاسبة العلف**
   - انتقل إلى "حاسبة علف القصب"
   - أدخل البيانات
   - شاهد النتائج

---

## 3️⃣ اختبار Mobile

### تشغيل التطبيق
```bash
cd frontend-mobile
npm install
npm start
```

### على الهاتف
```
- iOS: اضغط 'i'
- Android: اضغط 'a'
- Web: اضغط 'w'
```

---

## 🐛 اختبار الأخطاء

### 1. اختبار المصادقة
- حاول تسجيل الدخول ببيانات خاطئة
- يجب أن تظهر رسالة خطأ

### 2. اختبار الصلاحيات
- حاول الوصول إلى مزارع شخص آخر
- يجب أن ترفع رسالة "غير مصرح"

### 3. اختبار التحقق
- حاول إضافة مزرعة بدون اسم
- يجب أن تظهر رسالة خطأ

---

## 📊 Postman Collection

يمكنك استيراد هذا الـ Collection في Postman:

```json
{
  "info": {
    "name": "Smart Farm Management API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "url": "http://localhost:3000/api/auth/register"
          }
        },
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "url": "http://localhost:3000/api/auth/login"
          }
        }
      ]
    }
  ]
}
```

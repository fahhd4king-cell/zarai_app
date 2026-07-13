# 🔋 قائمة أفضل الممارسات

## 1️⃣ ممارسات Code

### TypeScript
```typescript
// جيد (بأنواع واضحة)
const getUserById = async (id: string): Promise<User> => {
  const user = await prisma.user.findUnique({ where: { id } });
  return user;
};

// سيئ (بدون أنواع)
const getUser = async (id) => {
  return await db.query(`SELECT * FROM users WHERE id = ${id}`);
};
```

### Error Handling
```typescript
// جيد
try {
  const farm = await prisma.farm.findUnique({ where: { id: farmId } });
  if (!farm) {
    return res.status(404).json({ error: 'المزرعة غير موجودة' });
  }
  return res.json(farm);
} catch (error: any) {
  console.error('Error:', error);
  res.status(500).json({ error: error.message });
}

// سيئ
const farm = db.farm(farmId);
return res.json(farm);
```

### Async/Await
```typescript
// جيد
await prisma.transaction.create({
  data: transactionData,
});

// سيئ
prisma.transaction.create({
  data: transactionData,
});
```

---

## 2️⃣ أمان التطبيق

### JWT Tokens
```typescript
// جيد - عين وقت انتهاء
const token = jwt.sign(
  { id, email },
  SECRET,
  { expiresIn: '7d' }
);

// سيئ - بدون وقت انتهاء
const token = jwt.sign({ id, email }, SECRET);
```

### Password Hashing
```typescript
// جيد
const hashedPassword = await bcrypt.hash(password, 10);
const isMatch = await bcrypt.compare(password, hashedPassword);

// سيئ
const isMatch = password === user.password;
```

### CORS
```typescript
// جيد - وحدة محدثة
app.use(cors({
  origin: ['http://localhost:5173', 'https://example.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

// سيئ - السماح للالل الأول
app.use(cors());
```

---

## 3️⃣ الأداء

### Database Queries
```typescript
// جيد - عدم N+1
const farms = await prisma.farm.findMany({
  include: { fields: true, livestock: true }
});

// سيئ - N+1 Query Problem
const farms = await prisma.farm.findMany();
for (const farm of farms) {
  farm.fields = await prisma.field.findMany({ where: { farmId: farm.id } });
}
```

### Caching
```typescript
// جيد
const cache = new Map();
if (cache.has(key)) {
  return cache.get(key);
}
const data = await fetchData();
cache.set(key, data);
return data;
```

---

## 4️⃣ Frontend Best Practices

### Component Structure
```tsx
// جيد - Components as functions
interface FarmCardProps {
  farm: Farm;
  onEdit?: (farm: Farm) => void;
}

const FarmCard: React.FC<FarmCardProps> = ({ farm, onEdit }) => {
  return (
    <div className="card">
      <h3>{farm.name}</h3>
    </div>
  );
};

export default FarmCard;
```

### State Management
```tsx
// جيد - Using hooks
const [farms, setFarms] = useState<Farm[]>([]);
const [loading, setLoading] = useState(false);

useEffect(() => {
  fetchFarms();
}, []);

// سيئ - Global state without context
const farms = globalState.farms;
```

### API Calls
```tsx
// جيد
const loadFarms = async () => {
  try {
    setLoading(true);
    const response = await axios.get('/api/farms', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setFarms(response.data);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    setLoading(false);
  }
};
```

---

## 5️⃣ Database Design

### Relationships
```typescript
// جيد - Clear relationships
model User {
  id    String  @id
  farms Farm[]  // One-to-Many
}

model Farm {
  id     String  @id
  userId String
  user   User    @relation(fields: [userId], references: [id])
  fields Field[] // One-to-Many
}

// سيئ - Ambiguous relationships
model Farm {
  id    String
  owner String // Who is the owner?
}
```

### Indexing
```typescript
// جيد - Indexes on frequently queried columns
model User {
  id    String @id
  email String @unique
  
  @@index([email])
}

// سيئ - No indexes
model User {
  id    String
  email String
}
```

---

## 6️⃣ Version Control

### Commit Messages
```
# جيد
feat: Add forage calculator API
fix: Correct JWT token validation
docs: Update API documentation
refactor: Simplify farm service

# سيئ
fix bug
update code
changes
```

### Branch Naming
```
# جيد
feature/forage-calculator
fix/auth-token-validation
docs/update-readme

# سيئ
feature1
fix-bug
wip-stuff
```

---

## 7️⃣ Testing

### Unit Tests
```typescript
import { describe, it, expect } from '@jest/globals';

describe('Forage Calculator', () => {
  it('should calculate daily need correctly', () => {
    const result = calculateDailyNeed(100, 2);
    expect(result).toBe(200);
  });
});
```

### Integration Tests
```typescript
describe('Farm API', () => {
  it('should create a farm', async () => {
    const response = await request(app)
      .post('/api/farms')
      .set('Authorization', `Bearer ${token}`)
      .send(farmData);
    
    expect(response.status).toBe(201);
  });
});
```

---

## 8️⃣ Documentation

### API Documentation
```markdown
## Get All Farms

**Endpoint:** `GET /api/farms`

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "id": "farm1",
    "name": "Farm Name",
    "area": 50
  }
]
```
```

### Code Comments
```typescript
// جيد - Meaningful comments
/**
 * Calculate the yearly forage need based on sheep count and daily consumption
 * @param sheepCount - Number of sheep
 * @param dailyConsumption - Daily consumption per sheep in kg
 * @returns Yearly forage need in kg
 */
const calculateYearlyNeed = (sheepCount: number, dailyConsumption: number) => {
  return sheepCount * dailyConsumption * 365;
};

// سيئ - Obvious comments
// Add 365 to convert to yearly
const yearly = daily * 365;
```

---

## 9️⃣ Performance Tips

### Frontend
- ✅ Use React.memo for heavy components
- ✅ Lazy load routes
- ✅ Minimize bundle size
- ✅ Optimize images
- ✅ Use useCallback and useMemo

### Backend
- ✅ Use connection pooling
- ✅ Cache frequently accessed data
- ✅ Paginate large datasets
- ✅ Use database indexes
- ✅ Implement rate limiting

---

## 10️⃣ Checklist Before Deployment

- [ ] All tests passing
- [ ] No console errors
- [ ] Environment variables configured
- [ ] Database backups
- [ ] API rate limiting enabled
- [ ] CORS properly configured
- [ ] Logging enabled
- [ ] Error monitoring setup (Sentry)
- [ ] Performance monitoring setup
- [ ] Security headers configured

---

**اتبع هذه الممارسات للحصول على تطبيق آمن وسريع وقابل للصيانة! 🚀**

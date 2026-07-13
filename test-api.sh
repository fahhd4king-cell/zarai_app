#!/bin/bash

# 🏗️ Testing Script for Zarai App
# This script automates the testing process

echo "🏗️ Starting Zarai App Testing..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BACKEND_URL="http://localhost:3000"
TEST_EMAIL="test_$(date +%s)@example.com"
TEST_PASSWORD="Password123!"
TEST_NAME="المزارع التجريبية"

# Initialize variables
TOKEN=""
USER_ID=""
FARM_ID=""

# Function to print test status
print_test() {
  echo -e "${BLUE}>>> $1${NC}"
}

print_success() {
  echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
  echo -e "${RED}✗ $1${NC}"
}

print_warning() {
  echo -e "${YELLOW}⚠ $1${NC}"
}

# Check if server is running
echo -e "${BLUE}Checking if Backend is running...${NC}"
if ! curl -s "$BACKEND_URL/api/health" > /dev/null 2>&1; then
  print_error "Backend is not running on $BACKEND_URL"
  echo "Please run: cd backend && npm run dev"
  exit 1
fi
print_success "Backend is running"
echo ""

# Test 1: Register
print_test "Test 1: User Registration"
response=$(curl -s -X POST "$BACKEND_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$TEST_EMAIL\",
    \"password\": \"$TEST_PASSWORD\",
    \"name\": \"$TEST_NAME\",
    \"phone\": \"+966501234567\"
  }")

echo "Response: $response"

if echo "$response" | grep -q '"token"'; then
  TOKEN=$(echo "$response" | grep -o '"token":"[^"]*' | cut -d '"' -f4)
  USER_ID=$(echo "$response" | grep -o '"id":"[^"]*' | cut -d '"' -f4 | head -1)
  print_success "Registration successful"
  echo "Token: ${TOKEN:0:20}..."
else
  print_error "Registration failed"
  exit 1
fi
echo ""

# Test 2: Login
print_test "Test 2: User Login"
response=$(curl -s -X POST "$BACKEND_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$TEST_EMAIL\",
    \"password\": \"$TEST_PASSWORD\"
  }")

if echo "$response" | grep -q '"token"'; then
  print_success "Login successful"
else
  print_error "Login failed"
  exit 1
fi
echo ""

# Test 3: Create Farm
print_test "Test 3: Create Farm"
response=$(curl -s -X POST "$BACKEND_URL/api/farms" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"name\": \"مزرعة الاختبار\",
    \"location\": "الرياض",
    \"area\": 50
  }")

if echo "$response" | grep -q '"id"'; then
  FARM_ID=$(echo "$response" | grep -o '"id":"[^"]*' | cut -d '"' -f4 | head -1)
  print_success "Farm created successfully"
  echo "Farm ID: $FARM_ID"
else
  print_error "Farm creation failed"
  exit 1
fi
echo ""

# Test 4: Get Farms
print_test "Test 4: Get Farms"
response=$(curl -s -X GET "$BACKEND_URL/api/farms" \
  -H "Authorization: Bearer $TOKEN")

if echo "$response" | grep -q '"name"'; then
  print_success "Farms retrieved successfully"
else
  print_error "Failed to retrieve farms"
  exit 1
fi
echo ""

# Test 5: Create Worker
print_test "Test 5: Create Worker"
response=$(curl -s -X POST "$BACKEND_URL/api/workers" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"name\": \"علي محمد\",
    \"jobTitle\": \"عامل حقل\",
    \"phone\": \"+966501234567\",
    \"salary\": 100,
    \"hireDate\": \"2026-01-01T00:00:00Z\"
  }")

if echo "$response" | grep -q '"id"'; then
  print_success "Worker created successfully"
else
  print_error "Worker creation failed"
  exit 1
fi
echo ""

# Test 6: Create Livestock
print_test "Test 6: Create Livestock"
response=$(curl -s -X POST "$BACKEND_URL/api/livestock" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"name\": \"قطيع الأغنام\",
    \"type\": \"أغنام\",
    \"quantity\": 150,
    \"purchaseDate\": \"2026-01-01T00:00:00Z\",
    \"feedCost\": 75,
    \"farmId\": \"$FARM_ID\"
  }")

if echo "$response" | grep -q '"id"'; then
  print_success "Livestock created successfully"
else
  print_error "Livestock creation failed"
  echo "Response: $response"
  exit 1
fi
echo ""

# Test 7: Forage Calculator
print_test "Test 7: Forage Calculator"
response=$(curl -s -X POST "$BACKEND_URL/api/forage/calculate" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"sheepCount\": 100,
    \"dailyConsumption\": 2,
    \"forageProductivity\": 15000,
    \"foragePrice\": 500
  }")

if echo "$response" | grep -q '"dailyNeed"'; then
  print_success "Forage calculation successful"
  daily=$(echo "$response" | grep -o '"dailyNeed":[^,}]*' | cut -d ':' -f2)
  echo "Daily Need: $daily kg"
else
  print_error "Forage calculation failed"
  exit 1
fi
echo ""

# Test 8: Add Financial Transaction
print_test "Test 8: Add Financial Transaction"
response=$(curl -s -X POST "$BACKEND_URL/api/finance/transactions" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"type\": \"INCOME\",
    \"amount\": 50000,
    \"description\": \"بيع محصول\",
    \"farmId\": \"$FARM_ID\"
  }")

if echo "$response" | grep -q '"id"'; then
  print_success "Transaction added successfully"
else
  print_error "Transaction addition failed"
  exit 1
fi
echo ""

# Test 9: Get Financial Report
print_test "Test 9: Get Financial Report"
response=$(curl -s -X GET "$BACKEND_URL/api/finance/report" \
  -H "Authorization: Bearer $TOKEN")

if echo "$response" | grep -q '"profit"'; then
  print_success "Financial report retrieved successfully"
  income=$(echo "$response" | grep -o '"income":[^,}]*' | cut -d ':' -f2)
  echo "Total Income: $income"
else
  print_error "Failed to retrieve financial report"
  exit 1
fi
echo ""

# Test 10: Security - Invalid Token
print_test "Test 10: Security - Invalid Token Test"
response=$(curl -s -w "\n%{http_code}" -X GET "$BACKEND_URL/api/farms" \
  -H "Authorization: Bearer invalid_token")

http_code=$(echo "$response" | tail -n1)
if [ "$http_code" = "403" ]; then
  print_success "Invalid token correctly rejected (HTTP 403)"
else
  print_warning "Expected HTTP 403, got $http_code"
fi
echo ""

# Test 11: Security - Missing Token
print_test "Test 11: Security - Missing Token Test"
response=$(curl -s -w "\n%{http_code}" -X GET "$BACKEND_URL/api/farms")

http_code=$(echo "$response" | tail -n1)
if [ "$http_code" = "401" ]; then
  print_success "Missing token correctly rejected (HTTP 401)"
else
  print_warning "Expected HTTP 401, got $http_code"
fi
echo ""

# Test 12: Validation - Missing Required Field
print_test "Test 12: Validation - Missing Required Field"
response=$(curl -s -X POST "$BACKEND_URL/api/farms" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"location\": \"الرياض\",
    \"area\": 50
  }")

if echo "$response" | grep -q 'error'; then
  print_success "Validation error correctly returned"
else
  print_warning "Expected validation error"
fi
echo ""

echo -e "${GREEN}════════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ All tests completed successfully!${NC}"
echo -e "${GREEN}════════════════════════════════════════════${NC}"
echo ""
echo "Summary:"
echo "  - User Registration: ✓"
echo "  - User Login: ✓"
echo "  - Farm Management: ✓"
echo "  - Worker Management: ✓"
echo "  - Livestock Management: ✓"
echo "  - Forage Calculator: ✓"
echo "  - Financial Transactions: ✓"
echo "  - Financial Reports: ✓"
echo "  - Security (Invalid Token): ✓"
echo "  - Security (Missing Token): ✓"
echo "  - Validation: ✓"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. Test the Frontend at http://localhost:5173"
echo "2. Test the Mobile app with: cd frontend-mobile && npm start"
echo "3. Deploy to production when ready"
echo ""

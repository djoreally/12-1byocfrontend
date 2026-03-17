# Backend Endpoint Audit — Booking Process

> Audit of all backend API endpoints consumed by the BYOC frontend, focused on the booking flow and supporting operations.

---

## 1. Endpoint Map

All API calls use the shared Axios instance (`src/api.js`) with base URL `NEXT_PUBLIC_API_URL` (default `http://localhost:8000/`). Authenticated routes inject a `Bearer` token from cookies via a request interceptor.

### Booking Endpoints

| # | Method | Endpoint | File | Auth | Purpose |
|---|--------|----------|------|------|---------|
| 1 | GET | `/store/GetStore/{storeId}` | `BookingProcces/[id]/page.js` | Bearer | Load store details for the booking page |
| 2 | POST | `/OuterApi/zipcode` | `BookingProcces/[id]/page.js` | Bearer | Validate zip code and resolve location |
| 3 | POST | `/Book/CreateBooking` | `BookingProcces/[id]/page.js` | Bearer | Submit a new booking |

### Authentication Endpoints

| # | Method | Endpoint | File | Auth | Purpose |
|---|--------|----------|------|------|---------|
| 4 | POST | `/auth/login` | `CustomerLogin/page.js` | None | User login, returns JWT |
| 5 | POST | `/auth/signup` | `CreateAccount/page.js` | None | User registration |
| 6 | POST | `/auth/forgotpassword` | `ForgotPassword/page.js` | None | Request password-reset OTP |
| 7 | POST | `/auth/verifyotp` | `ForgotPassword/page.js` | None | Verify OTP code |
| 8 | POST | `/auth/resetpassword` | `ForgotPassword/page.js` | None | Reset password with OTP |

### User Profile Endpoints

| # | Method | Endpoint | File | Auth | Purpose |
|---|--------|----------|------|------|---------|
| 9 | GET | `/Auth/GetUserData` | `Contextapi.js`, `settings/page.js` | Bearer | Fetch current user profile |
| 10 | PATCH | `/auth/updateProfile` | `settings/page.js` | Bearer | Update user profile (multipart) |

### Store Management Endpoints

| # | Method | Endpoint | File | Auth | Purpose |
|---|--------|----------|------|------|---------|
| 11 | GET | `/store/GetStore/{userId}` | `Contextapi.js`, `CreateStore/page.js` | Bearer | Load provider's own store |
| 12 | GET | `/store/GetStore` | `ServicePage/page.js` | Bearer | List all stores |
| 13 | GET | `/store/GetStore/{storeId}` | `Store/[id]/page.js` | Bearer | Load a single store's public page |
| 14 | POST | `/store/CreateStore` | `CreateStore/page.js` | Bearer | Create or update a store (multipart) |
| 15 | PATCH | `/store/UpdateStore` | `BusinessHours/page.js` | Bearer | Update store business hours |

### Subscription / Payment Endpoints

| # | Method | Endpoint | File | Auth | Purpose |
|---|--------|----------|------|------|---------|
| 16 | GET | `/subscribe/prices` | `Pricing/page.js` | Bearer | Fetch subscription plans |
| 17 | POST | `/subscribe/session` | `Pricing/page.js` | Bearer | Create Stripe checkout session |
| 18 | GET | `/subscribe/subscriptions` | `ProviderDashboard/main/page.js` | Bearer | Get current subscription status |

---

## 2. Broken or Risky Endpoints

### 2.1 Fixed in This PR

| Issue | File | Detail |
|-------|------|--------|
| **Missing leading `/` on endpoint** | `ProviderDashboard/main/page.js` | `subscribe/subscriptions` → `/subscribe/subscriptions`. Without the slash, Axios appends the path relative to the current URL instead of the base URL when called from a nested route. |
| **Unsafe error access** | `CustomerDashboard/settings/page.js` | `error.response.data.message` crashes when the server is unreachable (network error has no `.response`). Changed to `error?.response?.data?.message \|\| "..."`. |
| **Unsafe property access in filter** | `ServicePage/page.js` | `Data.ServiceArea.includes(zipcode)` throws if `ServiceArea` is `undefined`. Changed to `item?.ServiceArea?.includes(zipcode)`. |
| **Unsafe error logging** | `ServicePage/page.js` | `error.message` → `error?.message` to guard against unusual error shapes. |
| **Null-guard on context data** | `BusinessHours/page.js` | `data.ServiceHours?.length` → `data?.ServiceHours?.length` to prevent crash if context `data` is `null`. |
| **No 401 response handling** | `api.js` | Added a response interceptor that clears the token cookie and redirects to login on HTTP 401, preventing infinite loops with expired tokens. |

### 2.2 Remaining Risks (Require Backend Changes)

| Risk | Endpoint | Detail |
|------|----------|--------|
| **Inconsistent route casing** | `/Auth/GetUserData` vs `/auth/login` | The `/Auth/*` routes use PascalCase while `/auth/*` routes use lowercase. This can break if the backend enforces case sensitivity. Backend should unify casing. |
| **No rate limiting** | `/auth/login`, `/auth/forgotpassword`, `/auth/verifyotp` | Public auth endpoints have no client-visible rate limiting. Backend should enforce rate limits to prevent brute-force attacks. |
| **No CSRF protection** | All mutating endpoints | The app relies solely on a JWT Bearer token. If tokens are ever placed in a cookie with `httpOnly`, a CSRF token strategy would be needed. |
| **`/Book/CreateBooking` accepts raw arrays** | `/Book/CreateBooking` | The `Vehicle` and `selectedService` arrays are sent as-is from client state. Backend must validate array contents (types, required fields) to prevent injection of arbitrary data. |
| **Store ID from URL params** | `/store/GetStore/{id}`, `/Book/CreateBooking` | The `storeId` comes from URL params (`params.id`) and is used in both the GET and POST. Backend must validate the store ID is a valid ObjectId and belongs to an active store. |
| **Price calculated client-side** | `/Book/CreateBooking` | `TotalPrice` is computed on the frontend (`price + SERVICE_CHARGE`). Backend **must** recalculate the price server-side to prevent tampering. |
| **Silent error handling** | `Contextapi.js`, `BusinessHours/page.js` | Errors in context data fetching and business hours updates are silently caught. While not a backend issue, this hides server errors from the user. |

---

## 3. Data Contract Mismatches

### 3.1 `/Book/CreateBooking` (POST)

**Frontend payload:**
```json
{
  "TotalPrice": 42,
  "Vehicle": [
    { "Year": 2020, "Make": "Toyota", "Model": "Camry", "Engine": "2.5L" }
  ],
  "Date": "2024-03-15",
  "Time": "9:00 AM",
  "selectedService": [
    { "_id": "abc123", "service": "Oil Change", "price": "20" }
  ],
  "Location": {
    "city": "Dallas",
    "postal_code": "75201",
    "state": "TX",
    "country_code": "US"
  },
  "apt": "Apt 4B",
  "street": "428 Railroad Ave",
  "storeId": "store_object_id"
}
```

**Potential mismatches:**
| Field | Frontend Type | Risk |
|-------|-------------|------|
| `TotalPrice` | `number` (float) | Computed client-side. Backend must recompute to prevent price tampering. |
| `Vehicle` | `array<object>` | Contains raw vehicle objects from `csvjson.json`. Backend must validate each entry has `Year`, `Make`, `Model`, `Engine`. |
| `selectedService[].price` | `string` | Service prices come from the store data as strings (e.g., `"20"`). Frontend uses `parseFloat()` for display but sends the original string. Backend should coerce to number. |
| `Date` | `string` (YYYY-MM-DD) | No timezone info. Backend must clarify expected timezone. |
| `Time` | `string` | Raw value from `ServiceHours[].from` (e.g., `"9:00 AM"`). No standardized format. |
| `Location` | `object` | Comes directly from the zip code API response. Structure depends on third-party API. |
| `storeId` | `string` | Derived from `Data._id` which comes from the store GET response. Could be `undefined` if store data failed to load. |

### 3.2 `/auth/signup` (POST)

**Frontend payload:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "555-1234",
  "password": "secret123",
  "role": "customer"
}
```

**Potential mismatches:**
| Field | Issue |
|-------|-------|
| `phone` | Frontend requires non-empty but no format validation. Backend should enforce phone format. |
| `password` | Frontend requires min 6 chars. Backend should enforce the same or stricter policy. |
| `role` | Hardcoded to `"customer"` or `"provider"` from radio buttons. Backend must validate against whitelist. |

### 3.3 `/store/CreateStore` (POST, multipart/form-data)

**Frontend payload:**
```
StoreName: string
Description: string
ServiceArea: string
Tags: string
Logo: File
Thumbnail: File
address: string
Services: string (JSON.stringify of array)
```

**Potential mismatches:**
| Field | Issue |
|-------|-------|
| `Services` | Sent as a JSON-stringified string. Backend must parse it and validate the array structure. |
| `Logo`, `Thumbnail` | No client-side file-type or size validation. Backend must validate file types and enforce size limits. |
| `ServiceArea`, `Tags` | Comma-separated strings. Backend must parse and validate individual values. |

### 3.4 `/store/UpdateStore` (PATCH)

**Frontend payload:**
```json
{
  "ServiceHours": [
    { "day": "Monday", "from": "9:00 AM", "to": "5:00 PM", "status": true }
  ]
}
```

**Potential mismatches:**
| Field | Issue |
|-------|-------|
| `ServiceHours` | Array of day objects. No frontend validation on time format. Backend must validate `from`/`to` are valid times and `from` < `to`. |

### 3.5 `/auth/updateProfile` (PATCH, multipart/form-data)

**Frontend payload:**
```
name: string
address: string
image: File
phone: string
insurance: File
website: string
```

**Potential mismatches:**
| Field | Issue |
|-------|-------|
| `image`, `insurance` | No file-type or size validation on the frontend. Backend must validate. |
| `website` | No URL format validation on frontend. Backend should validate URL format. |

### 3.6 `/subscribe/session` (POST)

**Frontend payload:**
```json
{
  "priceId": "price_stripe_id"
}
```

**Potential mismatches:**
| Field | Issue |
|-------|-------|
| `priceId` | Comes from server-provided pricing data. Backend must validate it matches a real Stripe price ID. |

---

## 4. Endpoints Never Hit or Incorrectly Wired

| Finding | Detail |
|---------|--------|
| **No booking list/cancel/update endpoints** | The frontend displays bookings from context (`data?.Bookings`) which come from the store or user GET endpoints. There are no dedicated endpoints for listing bookings, cancelling a booking, or updating booking status from the customer side. |
| **No booking status update endpoint** | Provider dashboard shows active bookings but there is no visible API call to accept, reject, or complete a booking. Status changes appear to rely on data already in the store object. |
| **No logout endpoint** | The frontend clears the cookie client-side but never calls a server logout endpoint. If the backend maintains sessions or a token blacklist, stale tokens remain valid. |
| **Overloaded GET `/store/GetStore`** | This single endpoint serves three purposes: list all stores (no param), get one store by store ID, and get a store by user ID. The backend likely distinguishes by checking the param type, but this overloading can cause subtle routing bugs. |

---

## 5. Security Summary

| Category | Status | Detail |
|----------|--------|--------|
| Authentication | ✅ Implemented | JWT Bearer tokens via Axios interceptor |
| Token Expiry | ✅ Fixed | 401 response interceptor now clears token and redirects |
| Input Validation | ⚠️ Partial | Frontend validates required fields but not types/formats. Backend must be the authority. |
| Price Integrity | ❌ Risk | Price is client-computed. Backend must recalculate. |
| File Uploads | ⚠️ Partial | No client-side file-type/size checks. Backend must validate. |
| Rate Limiting | ❌ Missing | No evidence of rate limiting on auth endpoints. |
| Error Handling | ✅ Fixed | Unsafe error access patterns corrected in this PR. |

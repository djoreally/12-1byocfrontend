# Booking Flow Audit — `src/app/DynamicRoutes/BookingProcces/[id]/page.js`

## 1. State Map

| State Variable     | Initial Value | Step(s) Used       | Purpose                                      |
|--------------------|---------------|--------------------|----------------------------------------------|
| `steps`            | `0`           | All                | Current wizard step (0–3)                    |
| `Data`             | `null`        | All                | Store data fetched from `/store/GetStore/{id}` |
| `open`             | `false`       | 0, 3               | Address modal visibility                     |
| `codes`            | `""`          | 0 (modal)          | Raw zipcode input text                       |
| `street`           | `""`          | 0, 3 (modal)       | Street address input                         |
| `apt`              | `""`          | 0, 3 (modal)       | Apartment number input                       |
| `year`             | `""`          | 0                  | Vehicle year selector                        |
| `make`             | `""`          | 0                  | Vehicle make selector                        |
| `model`            | `""`          | 0                  | Vehicle model selector                       |
| `engine`           | `""`          | 0                  | Vehicle engine selector                      |
| `bookingDone`      | `false`       | Post-submit        | Controls success screen                      |
| `Vehicle`          | `[]`          | 0, 1, 2, 3, submit | Array of selected vehicle objects             |
| `selectedService`  | `[]`          | 1, 2, 3, submit    | Array of selected service objects             |
| `bookingDate`      | `undefined`   | 3, submit          | Selected date string (YYYY-MM-DD)            |
| `Time`             | `undefined`   | 3, submit          | Selected time slot (from ServiceHours)       |
| `zipcode`          | `""`          | 0, 3, submit       | Validated zipcode object from API            |
| `price`            | `0`           | Cart sidebar       | Derived total price (services × vehicles)    |
| `isSubmitting`     | `false`       | 3 (submit)         | Prevents double-submit                       |

## 2. State Required for Booking Submission (`POST /Book/CreateBooking`)

| Payload Field      | Source State        | Required | Type Expected            |
|--------------------|---------------------|----------|--------------------------|
| `TotalPrice`       | Derived at submit   | Yes      | Number                   |
| `Vehicle`          | `Vehicle`           | Yes      | Array of vehicle objects  |
| `Date`             | `bookingDate`       | Yes      | String (YYYY-MM-DD)      |
| `Time`             | `Time`              | Yes      | String (e.g. "9:00 AM")  |
| `selectedService`  | `selectedService`   | Yes      | Array of service objects  |
| `Location`         | `zipcode`           | Yes      | Object (city, state, …)  |
| `apt`              | `apt`               | No       | String                   |
| `street`           | `street`            | Yes      | String                   |
| `storeId`          | `Data._id`          | Yes      | String (MongoDB ObjectId) |

## 3. Step-by-Step Validation Audit

### Step 0 → Step 1 ("Vehicle data & address" → "Select service")

| Check                         | Status |
|-------------------------------|--------|
| `Vehicle.length > 0`         | ✅ Present |
| `zipcode` is resolved object  | ✅ Fixed — now checks `zipcode.city` and `zipcode.state` |
| `street` is non-empty         | ✅ Present |

### Step 1 → Step 2 ("Select service" → "Pay & Book")

| Check                              | Status |
|------------------------------------|--------|
| `selectedService.length > 0`      | ✅ Present |

### Step 2 → Step 3 ("Pay & Book" → "Confirm")

| Check                         | Status |
|-------------------------------|--------|
| No validation                 | ℹ️ Acceptable — step 2 is a review screen, no new data is entered |

### Step 3 → Submit ("Confirm" → `BookHandler`)

| Check                              | Status |
|------------------------------------|--------|
| `Data` and `Data._id` exist        | ✅ Fixed — now guards against null store data |
| `Vehicle.length > 0`              | ✅ Present |
| `selectedService.length > 0`      | ✅ Present |
| `zipcode` is resolved + has fields | ✅ Fixed — checks `zipcode.city` and `zipcode.state` |
| `street` is non-empty              | ✅ Present |
| `bookingDate` is set               | ✅ Present |
| `Time` is set                      | ✅ Present |
| Double-submit prevention           | ✅ Present (`isSubmitting` flag) |

## 4. Exact Payload Construction Trace

The `BookHandler` function (line ~200) constructs and sends the payload to `POST /Book/CreateBooking`.

### 4.1 Field-by-Field Origin and Transform

| Payload Field      | Source State         | Origin                                                   | Transformed Before Submit? | Notes |
|--------------------|----------------------|----------------------------------------------------------|---------------------------|-------|
| `TotalPrice`       | Derived inline       | `computeServiceTotal(selectedService, Vehicle.length) + SERVICE_CHARGE` | ✅ Yes — recomputed at submit time from service prices × vehicle count + $2 flat charge | Not from stale `price` state |
| `Vehicle`          | `Vehicle` state      | Objects from `csvjson.json` filtered by Year/Make/Model/Engine | ✅ Yes — normalized to `{Year, Make, Model, Engine}` only | Raw CSV objects had 13+ extra fields (Engine Oil, Oil Capacity, Oil Plug Torque, etc.) that are now stripped |
| `Date`             | `bookingDate` state  | `value.format("YYYY-MM-DD")` via Ant Design Calendar `onChange` | ❌ No transform — passed as-is | String format "YYYY-MM-DD" |
| `Time`             | `Time` state         | `data.from` from `Data.ServiceHours` via Select component | ❌ No transform — passed as-is | Only the `from` value, not the full time range object |
| `selectedService`  | `selectedService` state | Full service objects from `Data.Services` (fetched from store API) | ✅ Yes — normalized to `{_id, service, price}` with `price` parsed to Number | Raw objects had extra fields like `serviceDescription`; `price` was string |
| `Location`         | `zipcode` state      | `response.data.results[codes][0]` from `POST /OuterApi/zipcode` | ✅ Yes — normalized to `{city, state, postal_code, country_code}` | Raw API response may have had additional fields from external zipcode service |
| `apt`              | `apt` state          | User text input in address modal                          | ✅ Yes — `.trim()` applied at submit | Optional field |
| `street`           | `street` state       | User text input in address modal                          | ✅ Yes — `.trim()` applied at submit, checked for empty after trim | Required field |
| `storeId`          | `Data._id`           | `response.data.data._id` from `GET /store/GetStore/{params.id}` | ❌ No transform — passed as-is | MongoDB ObjectId string |

### 4.2 Payload Shape Sent to Backend

```json
{
  "TotalPrice": 42,
  "Vehicle": [
    { "Year": 2022, "Make": "Acura", "Model": "ILX", "Engine": 2.4 }
  ],
  "Date": "2026-03-20",
  "Time": "9:00 AM",
  "selectedService": [
    { "_id": "abc123", "service": "Oil Change", "price": 20 }
  ],
  "Location": {
    "city": "Springfield",
    "state": "IL",
    "postal_code": "62701",
    "country_code": "US"
  },
  "apt": "4B",
  "street": "428 Railroad Ave",
  "storeId": "64a1b2c3d4e5f6g7h8i9j0"
}
```

### 4.3 Validation Before Submission

| Check | Validated? | Details |
|-------|------------|---------|
| `Data` and `Data._id` non-null | ✅ | Guards against store fetch failure |
| `Vehicle.length > 0` | ✅ | At least one vehicle required |
| `selectedService.length > 0` | ✅ | At least one service required |
| `zipcode.city`, `zipcode.state`, and `zipcode.postal_code` non-empty | ✅ | Zipcode is a resolved object with required fields |
| `street` non-empty (after trim) | ✅ | Whitespace-only strings rejected |
| `bookingDate` is set | ✅ | Cannot be undefined |
| `Time` is set | ✅ | Cannot be undefined |
| `isSubmitting` guard | ✅ | Prevents double-submit |
| `TotalPrice > 0` | ❌ | Not explicitly checked — could be $2 (SERVICE_CHARGE only) if all service prices are 0 |
| `bookingDate` is not in the past | ⚠️ | Enforced by `disabledDate` on Calendar UI, but not re-validated in `BookHandler` |
| `Vehicle[].Year/Make/Model/Engine` individually non-null | ⚠️ | Relies on `addCar` validation at add-time; not re-checked at submit |
| `selectedService[]._id` non-null | ⚠️ | Relies on store data having `_id`; not explicitly validated |

## 5. Submit Payload Risk Report

### 5.1 Previously Identified Risks (All Fixed)

| Field          | Risk                                                   | Status    |
|----------------|--------------------------------------------------------|-----------|
| `TotalPrice`   | Was using stale `price` state; could drift from display | ✅ Fixed — recomputed at submit time |
| `TotalPrice`   | `parseFloat(undefined)` → `NaN`                        | ✅ Fixed — `parseFloat(x) \|\| 0` guard added |
| `Vehicle`      | Could be empty array at submit                         | ✅ Validated |
| `Date`         | Could be `undefined` if no date selected               | ✅ Validated |
| `Date`         | Past dates were selectable                             | ✅ Fixed — `disabledDate` added to Calendar |
| `Time`         | Could be `undefined` if no time selected               | ✅ Validated |
| `Location`     | Could be `""` (initial) instead of resolved object     | ✅ Fixed — validates object fields |
| `street`       | Could be empty string                                  | ✅ Validated (truthy check after trim) |
| `apt`          | Can be empty string (optional field)                   | ℹ️ Acceptable — apartment is optional |
| `storeId`      | `Data` could be `null` → `TypeError`                   | ✅ Fixed — null guard + loading screen |

### 5.2 Payload Shape Risks (Newly Identified, Fixed)

| Risk                                                        | Severity | Status |
|-------------------------------------------------------------|----------|--------|
| `Vehicle` sent entire CSV row objects with 13+ extra fields (Engine Oil, Oil Capacity, Oil Plug Torque, Automatic Transmission Fluid, Transfer Case, Rear Differential, Front Differential, Oil Life Reset Instructions, Manual Transmission Fluid) | High | ✅ Fixed — normalized to `{Year, Make, Model, Engine}` |
| `selectedService` sent full store service objects with extra metadata (serviceDescription, etc.) | Medium | ✅ Fixed — normalized to `{_id, service, price}` |
| `Location` sent raw external zipcode API response (unknown extra fields) | Medium | ✅ Fixed — normalized to `{city, state, postal_code, country_code}` |
| `street` and `apt` sent with untrimmed whitespace | Low | ✅ Fixed — `.trim()` applied |

### 5.3 Likely Backend Mismatch Risks

| Risk | Details | Recommendation |
|------|---------|----------------|
| **`selectedService` naming** | Frontend sends `selectedService` (camelCase). If backend expects `services` or `Services`, the field will be silently ignored. | Confirm backend schema field name |
| **`price` is now a Number** | Service `price` values are parsed to Number via `parseFloat(price) \|\| 0` in the normalized payload | ✅ Fixed |
| **`Vehicle` has PascalCase keys** | Vehicle objects use `{Year, Make, Model, Engine}` (PascalCase from CSV). Backend may expect camelCase `{year, make, model, engine}`. | Confirm backend schema casing |
| **`Engine` is a float** | Engine values come from CSV as numbers (e.g. `2.4`, `3.5`). Backend may expect string. | Confirm backend type |
| **`TotalPrice` is client-computed** | Price is computed client-side and trusted by the backend. A malicious client can send any value. | Backend should recompute from service IDs |
| **`Date` string format** | Frontend sends `"YYYY-MM-DD"` string. Backend may expect an ISO 8601 datetime or a Date object. | Confirm backend date parsing |
| **`Time` is only `from` value** | Time dropdown shows `"9:00 AM - 5:00 PM"` but only sends `"9:00 AM"` (the `data.from` value). Backend may expect the full range or a different format. | Confirm backend time format |

### 5.4 Suggested Safer Payload Shape

The following is the ideal normalized payload shape, assuming the backend were designed today:

```json
{
  "totalPrice": 42,
  "vehicles": [
    { "year": 2022, "make": "Acura", "model": "ILX", "engine": "2.4" }
  ],
  "date": "2026-03-20",
  "time": "9:00 AM",
  "services": [
    { "serviceId": "abc123", "name": "Oil Change", "price": 20 }
  ],
  "location": {
    "city": "Springfield",
    "state": "IL",
    "postalCode": "62701",
    "countryCode": "US"
  },
  "apartment": "4B",
  "street": "428 Railroad Ave",
  "storeId": "64a1b2c3d4e5f6g7h8i9j0"
}
```

Key differences from current payload:
- All field names use consistent camelCase
- `services` instead of `selectedService`
- `serviceId` instead of `_id` (explicit naming)
- `price` as Number, not String
- `vehicles` (plural lowercase) instead of `Vehicle` (singular PascalCase)
- `postalCode` and `countryCode` use camelCase (no underscores)
- `apartment` fully spelled out instead of `apt`

> **Note**: The current payload matches what the existing backend likely expects (since it has been working). The "safer shape" above is aspirational — changing to it would require coordinated backend changes.

## 6. Top 10 Bugs / Failure Points (Pre-Fix)

### Bug 1: `Data._id` crash when store fetch fails — **FIXED**
- **Severity**: Critical
- **Description**: If `GET /store/GetStore/{id}` fails, `Data` stays `null`. Clicking "Book now" causes `TypeError: Cannot read properties of null (reading '_id')`.
- **Fix**: Added null guard in `BookHandler` and a loading spinner until `Data` is fetched.

### Bug 2: Vehicle payload bloat — **FIXED**
- **Severity**: High
- **Description**: `Vehicle` array contained full CSV row objects with 13+ extra fields (Engine Oil, Oil Capacity, Oil Plug Torque, Automatic Transmission Fluid, Transfer Case, etc.). These extra fields were sent to the backend on every booking.
- **Fix**: Normalized Vehicle objects to `{Year, Make, Model, Engine}` only before submission.

### Bug 3: Past dates selectable on Calendar — **FIXED**
- **Severity**: High
- **Description**: The Ant Design `Calendar` component had no `disabledDate` prop, allowing users to select dates in the past.
- **Fix**: Added `disabledDate` function that disables all dates before today, plus a guard in `onPanelChange`.

### Bug 4: `TotalPrice` could be `NaN` — **FIXED**
- **Severity**: High
- **Description**: `parseFloat(data?.price)` returns `NaN` if `price` is `undefined` or non-numeric. `NaN` would propagate into the booking payload.
- **Fix**: Changed to `parseFloat(data?.price) || 0`.

### Bug 5: `TotalPrice` staleness at submit — **FIXED**
- **Severity**: Medium
- **Description**: `price` state is computed via `useEffect` on `[selectedService, Vehicle]`. If React hasn't flushed the effect before `BookHandler` runs, the submitted `TotalPrice` could be stale.
- **Fix**: `BookHandler` now recomputes the total inline instead of relying on `price` state.

### Bug 6: Raw Location object from external API — **FIXED**
- **Severity**: Medium
- **Description**: `Location` field sent the raw response from the external zipcode API. Unknown extra fields could leak into the booking payload, and the shape was not guaranteed.
- **Fix**: Normalized to `{city, state, postal_code, country_code}` before submission.

### Bug 7: Zipcode validation only checked truthiness — **FIXED**
- **Severity**: Medium
- **Description**: The step transition and submit checks only tested `!zipcode`, which passes for any truthy value (including a partial/malformed object). A zipcode API response without `city` or `state` would pass validation.
- **Fix**: Now checks `zipcode.city` and `zipcode.state` explicitly.

### Bug 8: No loading state for initial store data fetch — **FIXED**
- **Severity**: Medium
- **Description**: While `Data` is `null` (store data loading), the entire booking form renders with undefined service lists. `Data?.Services?.map(…)` returns `undefined` silently but the user sees an empty/broken UI.
- **Fix**: Added loading spinner that renders until `Data` is populated.

### Bug 9: `street` setter has typo (`setStreeet`)
- **Severity**: Low (cosmetic)
- **Description**: The state setter is named `setStreeet` (three e's). This works but is a maintenance concern.
- **Status**: Not fixed (functional, renaming would be a large diff for a typo).

### Bug 10: Untrimmed whitespace in street/apt — **FIXED**
- **Severity**: Low
- **Description**: `street` and `apt` text inputs were sent as-is to the backend. A user entering `"  428 Railroad Ave  "` or whitespace-only would pass the truthy check but send bad data.
- **Fix**: Both fields are `.trim()`ed before validation and submission.

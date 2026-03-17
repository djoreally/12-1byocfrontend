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

## 4. Submit Payload Risk Report

| Field          | Risk                                                   | Status    |
|----------------|--------------------------------------------------------|-----------|
| `TotalPrice`   | Was using stale `price` state; could drift from display | ✅ Fixed — recomputed at submit time |
| `TotalPrice`   | `parseFloat(undefined)` → `NaN`                        | ✅ Fixed — `parseFloat(x) \|\| 0` guard added |
| `Vehicle`      | Could be empty array at submit                         | ✅ Validated |
| `Date`         | Could be `undefined` if no date selected               | ✅ Validated |
| `Date`         | Past dates were selectable                             | ✅ Fixed — `disabledDate` added to Calendar |
| `Time`         | Could be `undefined` if no time selected               | ✅ Validated |
| `Location`     | Could be `""` (initial) instead of resolved object     | ✅ Fixed — validates object fields |
| `street`       | Could be empty string                                  | ✅ Validated (truthy check) |
| `apt`          | Can be empty string (optional field)                   | ℹ️ Acceptable — apartment is optional |
| `storeId`      | `Data` could be `null` → `TypeError`                   | ✅ Fixed — null guard + loading screen |

## 5. Top 10 Bugs / Failure Points (Pre-Fix)

### Bug 1: `Data._id` crash when store fetch fails — **FIXED**
- **Severity**: Critical
- **Description**: If `GET /store/GetStore/{id}` fails, `Data` stays `null`. Clicking "Book now" causes `TypeError: Cannot read properties of null (reading '_id')`.
- **Fix**: Added null guard in `BookHandler` and a loading spinner until `Data` is fetched.

### Bug 2: Past dates selectable on Calendar — **FIXED**
- **Severity**: High
- **Description**: The Ant Design `Calendar` component had no `disabledDate` prop, allowing users to select dates in the past.
- **Fix**: Added `disabledDate` function that disables all dates before today, plus a guard in `onPanelChange`.

### Bug 3: `TotalPrice` could be `NaN` — **FIXED**
- **Severity**: High
- **Description**: `parseFloat(data?.price)` returns `NaN` if `price` is `undefined` or non-numeric. `NaN` would propagate into the booking payload.
- **Fix**: Changed to `parseFloat(data?.price) || 0`.

### Bug 4: `TotalPrice` staleness at submit — **FIXED**
- **Severity**: Medium
- **Description**: `price` state is computed via `useEffect` on `[selectedService, Vehicle]`. If React hasn't flushed the effect before `BookHandler` runs, the submitted `TotalPrice` could be stale.
- **Fix**: `BookHandler` now recomputes the total inline instead of relying on `price` state.

### Bug 5: Zipcode validation only checked truthiness — **FIXED**
- **Severity**: Medium
- **Description**: The step transition and submit checks only tested `!zipcode`, which passes for any truthy value (including a partial/malformed object). A zipcode API response without `city` or `state` would pass validation.
- **Fix**: Now checks `zipcode.city` and `zipcode.state` explicitly.

### Bug 6: No loading state for initial store data fetch — **FIXED**
- **Severity**: Medium
- **Description**: While `Data` is `null` (store data loading), the entire booking form renders with undefined service lists. `Data?.Services?.map(…)` returns `undefined` silently but the user sees an empty/broken UI.
- **Fix**: Added loading spinner that renders until `Data` is populated.

### Bug 7: No vehicle/service removal capability
- **Severity**: Low
- **Description**: Once a vehicle or service is added to the cart, there is no UI to remove it. Users must refresh the page to start over.
- **Status**: Not fixed (UX enhancement, not a validation bug).

### Bug 8: `street` setter has typo (`setStreeet`)
- **Severity**: Low (cosmetic)
- **Description**: The state setter is named `setStreeet` (three e's). This works but is a maintenance concern.
- **Status**: Not fixed (functional, renaming would be a large diff for a typo).

### Bug 9: Zipcode debounce fires on every keystroke after 500ms
- **Severity**: Low
- **Description**: The zipcode API call fires after 500ms of no typing, which is correct debouncing. However, there is no loading indicator for the zipcode lookup, so users may save the modal before the lookup completes.
- **Status**: Not fixed (minor UX issue).

### Bug 10: Calendar `onChange` fires on month navigation
- **Severity**: Low
- **Description**: Ant Design's `Calendar` `onChange` fires when navigating months, not just selecting a date. This can set `bookingDate` unintentionally when browsing months. The past-date guard mitigates some risk.
- **Status**: Acknowledged — current `onChange` handler now prevents past dates but month navigation behavior is inherent to Ant Design Calendar.

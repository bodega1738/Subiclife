# Subic.Life - Complete App Reference
## Master Document for LLM Implementation

*Last Updated: December 2024*
*Version: 1.1 - UI-Only Phase*

---

## 🎨 Current Development Phase

**UI/VISUAL DEVELOPMENT ONLY**

This document describes the complete Subic.Life application, but the current implementation phase focuses **exclusively on frontend/UI development**.

**What This Means:**
- ✅ Build all screens, components, and interactions
- ✅ Use hardcoded mock data (no database queries)
- ✅ Implement OpenAI Concierge (real API with hardcoded context)
- ✅ Client-side state management (React Context, useState)
- ❌ NO Supabase integration yet (schema documented for future)
- ❌ NO backend API routes yet (except OpenAI endpoint)
- ❌ NO real authentication (demo login UI only)

**See [Demo-Specific Constraints](#demo-specific-constraints) for complete implementation guidelines.**

---

# Table of Contents
1. [Executive Summary](#executive-summary)
2. [Complete Feature Inventory](#complete-feature-inventory)
3. [User Flows](#user-flows)
4. [Design Language](#design-language)
5. [Technical Architecture](#technical-architecture)
6. [Boundaries & Constraints](#boundaries-constraints)

---

# Executive Summary

## What is Subic.Life?

Subic.Life is a **premium travel membership platform** for Subic Bay, Philippines. It connects tourists and expatriates with exclusive discounts, experiences, and services across 50+ local partner businesses while supporting environmental conservation.

Think of it as: **"Airbnb + Costco Membership + Concierge Service"**

## Core Problem It Solves

**For Tourists/Expats:**
- Too many choices, no trusted curation
- Paying full tourist prices
- Fragmented booking across multiple apps
- No travel insurance coverage
- Language/cultural barriers

**For Local Businesses:**
- Low tourist season traffic
- High marketing costs to reach visitors
- Lost revenue to big OTAs (Booking.com, Agoda)
- Difficulty verifying legitimate customers

**For the Environment:**
- Tourism causes environmental degradation
- No sustainable tourism funding model

## The Solution

A **two-sided marketplace** where:
- **Members** pay annual fee → Get discounts (5-20%), insurance (₱25K-₱1M), OpenAI GPT-4 powered concierge, seamless booking
- **Merchants** get marketing exposure, customer traffic, booking management tools
- **5% of profits** fund beach cleanup and conservation

## Who Uses It?

### Primary Users (Tourists/Expats)
- **Age:** 25-55 years old
- **Income:** Middle to upper class
- **Profile:** Tech-savvy, values convenience, seeks exclusive access
- **Nationalities:** International tourists + Filipino travelers + expats living in/near Subic Bay
- **Use Case:** Weekend getaways, business trips, living/relocating to Subic Bay

### Secondary Users (Merchants)
- **Who:** Hotels, restaurants, yacht operators, activity centers, tour operators
- **Size:** Small to medium local businesses
- **Need:** Customer acquisition, booking management, revenue visibility
- **Staff:** Front desk, managers, owners using tablets/phones

## Business Model

**Revenue:**
- Membership fees: ₱150 (Registration), ₱550 (Basic), ₱5,500 (Premium), ₱25,500 (Elite) per year
- 10% commission on bookings processed through platform

**Value Exchange:**
- Members save 5-25% per transaction → ROI on membership fee
- Merchants get marketing + customers → Worth the 10% commission
- Environment gets 5% of profits → Sustainable tourism model

## Key Differentiation

1. **City-Centric:** Only Subic Bay (not nationwide) = deep local curation
2. **Tiered Benefits:** Gamified progression = recurring engagement
3. **Insurance Included:** Travel insurance built-in = peace of mind
4. **Environmental Impact:** 5% to conservation = purpose-driven
5. **Unified Experience:** One app replaces 5+ booking platforms

---

# Complete Feature Inventory

## User App (Member-Facing)

### Screen 1: Onboarding Quiz (Optional)
**Purpose:** Personalize recommendations
**When:** First launch only, can be skipped
**Components:**
- 3 questions with visual answer options
- Progress indicator (1 of 3, 2 of 3, 3 of 3)
- Skip button (always visible)
- Back button (after question 1)

**Questions:**
1. What brings you to Subic Bay? (Vacation, Business, Living here, Special event)
2. Who are you traveling with? (Partner, Family, Friends, Solo)
3. What's your travel vibe? (Foodie, Adventurer, Relaxation, Nightlife)

**Data Saved:** Stored in user preferences for personalized deals

**Does NOT Have:**
- Account creation (that's separate)
- Payment (that's separate)
- More than 3 questions

---

### Screen 1B: Package Upgrade Offer (After Quiz)
**Purpose:** Present membership upgrade options after onboarding quiz
**When:** After completing (or skipping) 3-question quiz, before Home Dashboard
**Note:** User already has Registration tier (paid ₱150 during signup)

**Components:**

**Header:**
- Title: "Unlock More Benefits" (text-2xl font-bold, center)
- Subtitle: "You're currently on Registration (5% discount). Upgrade to save even more!" (text-sm text-gray-600, center)

**Current Tier Card (Top):**
- Small card showing current Registration tier
- "YOUR CURRENT PLAN" label (text-xs uppercase gray)
- Registration badge (blue)
- Benefits list: ✓ 5% discount, ✓ ₱25K insurance, ✓ Event announcements
- Price: ₱150/year (already paid)

**Upgrade Options (3 cards, vertical stack):**

**1. Basic Package Card**
- "MOST POPULAR" badge
- Tier name: "Basic"
- Price: ₱550/year with "Save ₱400 from Registration"
- Benefits list:
  - ✓ 10% discount (was 5%)
  - ✓ ₱100,000 insurance (was ₱25K)
  - ✓ AI 24hr basic inquiry & directory
  - ✓ All Registration benefits
- "Upgrade to Basic" button

**2. Premium Package Card**
- "BEST VALUE" badge
- Tier name: "Premium"
- Price: ₱5,500/year with "Save ₱5,000 from Registration"
- Benefits list:
  - ✓ 15% discount (was 5%)
  - ✓ ₱500,000 insurance (was ₱25K)
  - ✓ AI 24/7 concierge & booking services
  - ✓ Priority support
  - ✓ All Basic benefits
- "Upgrade to Premium" button

**3. Elite Package Card**
- "ULTIMATE" badge
- Tier name: "Elite"
- Price: ₱25,500/year with "Save ₱25,000+"
- Benefits list:
  - ✓ 20% discount (was 5%)
  - ✓ ₱1,000,000 insurance (was ₱25K)
  - ✓ Yacht cruise for 20 pax OR 4 room nights
  - ✓ AI 24/7 concierge & booking services
  - ✓ Priority booking & exclusive events
  - ✓ Airport lounge access
  - ✓ All Premium benefits
- "Upgrade to Elite" button

**Bottom Actions:**
- "Maybe Later" button
  - Takes user to Home Dashboard with Registration tier
- "Compare All Plans" link

**Interactions:**
- Tap "Upgrade to [Tier]" → Opens payment modal (demo: instant upgrade, no real payment)
- Tap "Maybe Later" → Navigate to Home Dashboard
- Tap "Compare All Plans" → Opens detailed comparison modal (side-by-side grid)

**Payment Modal (Demo):**
- Shows selected tier
- Payment method selector (Card/GCash/Maya) - all mocked
- "Confirm Upgrade" button
- Loading animation (2 seconds)
- Success: "🎉 Upgraded to [Tier]!" → Navigate to Home Dashboard with new tier

**Data Actions:**
```typescript
// When user upgrades
await supabase
  .from('users')
  .update({
    tier: selectedTier, // 'basic', 'premium', or 'elite'
    insurance_amount: newInsuranceAmount,
    // Update valid_until if adding to existing membership
  })
  .eq('id', userId)

// Award bonus points for upgrading
await supabase.rpc('add_points', { 
  user_id: userId, 
  points: 1000 // Bonus for upgrading
})
```

**Does NOT Have:**
- Annual vs. Monthly toggle (annual only)
- Free trial (paid memberships only)
- Comparison with competitor pricing
- Testimonials/reviews on this screen

---

### Screen 2: Home Dashboard
**Purpose:** Member's main hub - see status, discover deals, access features
**When:** After login, default landing page

**Components (Top to Bottom):**

1. **Header**
   - Avatar (44px circle, shows first letter if no image, green online dot)
   - Welcome message: "Welcome back," + user's first name
   - Notification bell (red dot if unread, badge count if >0)

2. **Deals for You (Featured & Curated)**
   - **Purpose:** Curated recommendations based on onboarding questionnaire
   - Horizontal scroll of premium deal cards
   - Large hero card for top recommendation
   - Partner deal cards (300px wide each)
   - Each shows: Image, discount badge, title, subtitle, original price, discounted price
   - Heart icon to favorite

3. **Available Offers** (Vertical List)
   - List of available deals and packages
   - Wide cards with image on left, details on right
   - Shows: Partner name, category, location, price, "Book" button

4. **Bottom Navigation** (Sticky, always visible)
   - Home | Discover | My Pass | Profile
   - Active tab: filled icon + blue text
   - Inactive: outlined icon + gray text

**Interactions:**
- Tap Quick Action → Navigate to filtered partners list
- Tap Deal Card → Navigate to partner detail page
- Tap "Redeem Rewards" → Open rewards catalog modal
- Tap Notification Bell → Open notifications list
- Pull to refresh → Reload latest deals

**Data Displayed:**
- User: name, tier, points, insurance amount
- Featured offers: 3 promotional items
- Deals: 5-10 partner offers

**Does NOT Have:**
- Search bar (that's on Discover page)
- Category filter tabs (that's on Discover page)
- Booking forms (those are modals)

---

### Screen 3: Partners Discovery (Discover Tab)
**Purpose:** Browse and search all partner merchants
**When:** Tap "Discover" in bottom nav OR tap Quick Action

**Components:**

1. **Header**
   - Title: "Partners"
   - Search bar: Full-width, rounded, "Search partners..." placeholder, search icon

2. **Category Tabs** (Horizontal scroll)
   - All | Hotels | Activities | Dining | Water Sports | Services
   - Active tab: blue background, white text
   - Inactive: gray background, gray text

3. **Partner Cards Grid** (2 columns)
   - Each card shows:
     - Image (4:3 aspect ratio)
     - Heart icon (favorite toggle, top-right)
     - Partner name
     - Category badge
     - Discount badge (e.g., "25% OFF")
     - Star rating (if available)
     - "View Details" link
   - Cards are white background, rounded corners, shadow on hover

4. **Empty State** (if no results)
   - Icon, "No partners found" message
   - "Try adjusting search" suggestion
   - "Explore All" button

**Interactions:**
- Type in search → Filter results (debounced 300ms)
- Tap category tab → Filter by category
- Tap partner card → Navigate to partner detail
- Tap heart → Toggle favorite (optimistic UI, syncs to Supabase)

**Data Source:** Supabase `partners` table, filtered by category and search query

**Does NOT Have:**
- Booking forms (those open from partner detail page)
- Member card display (that's on My Pass)
- Category tabs with "NEW" badges (simplified to just category names)

---

### Screen 4: Partner Detail
**Purpose:** Show full information about a specific partner, enable booking
**When:** Tap a partner card from Discovery or Home

**Components:**

1. **Image Gallery** (Top, full-width)
   - Swipeable horizontal scroll
   - Indicator dots at bottom
   - Image counter (e.g., "1 / 5")
   - Back button (floating top-left, white circle)
   - Share & Favorite buttons (floating top-right, white circles)

2. **Partner Info Section**
   - Partner name (large, bold)
   - Location with map pin icon
   - Category badge
   - Divider line

3. **Trust Signals Row** (3 columns, centered)
   - Star rating: ⭐ 4.96 (large, bold)
   - Guest favorite badge: 🏆 "Guest favorite" 🏆
   - Review count: "298 Reviews"

4. **About Section**
   - Description text (expandable if long)
   - "Show more" link if truncated

5. **Packages/Offers Section**
   - Package cards (vertical stack)
   - Each shows:
     - Package name
     - Inclusions list (checkmarks)
     - Original price (strikethrough)
     - Discounted price (bold, large)
     - Discount badge
     - "Select Package" button
   - Elite-only packages have "ELITE EXCLUSIVE" badge

6. **Reviews Section** (if available)
   - Review cards with avatar, name, rating, text
   - Review images (horizontal scroll)

7. **Location Section**
   - Static map placeholder or map embed
   - Address
   - "Get Directions" button

8. **Sticky Bottom Bar** (Always visible)
   - Left: "From ₱X,XXX" pricing + "Save ₱X,XXX (XX%)" in green
   - Right: "Request Booking" button (blue, prominent)

**Interactions:**
- Swipe gallery horizontally
- Tap Back → Return to previous screen
- Tap Share → Open share sheet
- Tap Favorite → Toggle saved status
- Tap Package "Select" → Opens booking flow with package pre-selected
- Tap "Request Booking" → Opens booking flow modal
- Tap "Get Directions" → Opens maps app with address

**Data Source:** 
- Supabase `partners` table (partner details)
- Hardcoded packages per partner (or future `packages` table)

**Does NOT Have:**
- Instant booking/payment (all bookings are requests that merchants approve)
- Live availability calendar (requests are reviewed by merchant)
- Chat with merchant (use contact button instead)

---

### Screen 5: Booking Flow - Hotels
**Purpose:** Multi-step form to request hotel booking
**When:** Tap "Request Booking" from hotel partner detail page
**Format:** Bottom sheet modal (slides up from bottom)

**Steps (7 total):**

**Step 1: Select Dates**
- Calendar component (month view)
- Check-in date selection
- Check-out date selection
- Selected range highlighted in blue
- Past dates disabled (grayed out)
- "Clear dates" link

**Step 2: Room Type**
- Radio button cards for room options
- Each shows: Room name, bed type, bathroom type, price
- Selected: blue border, blue background tint

**Step 3: Guests**
- Stepper controls (+ and - buttons)
- Adults count (default 1, min 1)
- Children count (default 0, min 0)
- Minus button disabled when at minimum

**Step 4: Special Requests** (Optional)
- Textarea for requests
- Placeholder: "Ocean view room, early check-in, etc."
- Character counter: "0 / 500"

**Step 5: Review Booking**
- Partner card thumbnail with name and rating
- Trip details section:
  - Dates
  - Room type
  - Guests
  - "Change" button to go back
- Pricing breakdown:
  - Subtotal
  - Member discount (in green)
  - Total (large, bold)
- Free cancellation policy note

**Step 6: Payment Options**
- Radio buttons for 3 options:
  1. Pay full amount now (card/GCash/Maya)
  2. Pay deposit now (₱2,000), rest on arrival
  3. Pay on arrival (no payment now)
- If "Pay now" selected:
  - Payment method tabs (Card | GCash | Maya)
  - Card fields: Number, Expiry, CVV, Name
  - All fields h-12, rounded corners
  - 🔒 "Secured by Stripe" badge (visual only, no real processing)
- Note: Payment is SIMULATED for demo (no real charges)

**Step 7: Success**
- ✅ Large green checkmark (animated scale)
- "Booking Request Sent!" heading
- Message: "Partner will review your request"
- Expected response time: "Usually within 2 hours"
- Booking reference number: "#SL-2024-1234"
- "View Booking" button (blue) → Goes to My Pass
- "Return Home" button (white border)

**Navigation:**
- Progress indicator shows "Step X of 7"
- Back button (except on step 1)
- Next button (changes to "Submit" on step 6)
- Close X (top-right, shows confirmation dialog)

**Data Actions:**
- Step 6 Submit → Creates record in Supabase `bookings` table
- Status: "pending"
- Creates notification for merchant
- Awards 500 points to user (if booking accepted later)

**Does NOT Have:**
- Real payment processing (it's mocked)
- Instant confirmation (merchant must approve)
- Price comparison with other sites
- Loyalty program integration beyond points

---

### Screen 6: Booking Flow - Restaurants
**Purpose:** Simplified booking for restaurant reservations
**When:** Tap "Request Booking" from restaurant partner detail
**Format:** Bottom sheet modal

**Steps (5 total):**

**Step 1: Date & Time**
- Calendar for date selection (single date, not range)
- Time slot grid (2 columns)
  - 30-minute intervals (11:00 AM, 11:30 AM, etc.)
  - Dinner slots (5-10 PM) highlighted
  - Selected: blue background
  - Unavailable: grayed out, strikethrough

**Step 2: Party Size**
- Stepper for adults
- Stepper for children
- Maximum warning if exceeds restaurant capacity

**Step 3: Special Requests**
- Quick select chips (multi-select):
  - Vegetarian, Vegan, Gluten-free, Halal, Birthday celebration
- Textarea for additional notes
- Placeholder: "Window seat, allergies, special occasion..."

**Step 4: Review**
- Restaurant thumbnail and name
- Reservation details (date, time, party size)
- Special requests preview
- Discount reminder: "Your 25% Elite discount applies"
- Note: "Present membership card when paying"

**Step 5: Submit**
- No payment step (pay at restaurant)
- "Confirm Reservation" button
- Loading spinner while submitting

**Success Screen:**
- ✅ "Reservation Requested!"
- Confirmation number
- "Add to Calendar" button (generates .ics file)
- "Get Directions" button
- "View Reservation" button

**Does NOT Have:**
- Online payment (restaurants are pay-on-arrival)
- Menu preview
- Table selection (merchant assigns)

---

### Screen 7: Booking Flow - Yachts/Water Sports
**Purpose:** Book yacht cruises, jet ski rentals, sailing lessons
**When:** Tap "Request Booking" from water sports partner
**Format:** Bottom sheet modal

**Steps (7 total):**

**Step 1: Select Package**
- Package cards showing:
  - Image (yacht/jetski photo)
  - Package name (e.g., "Sunset Cruise")
  - Duration (2 hours, 4 hours, etc.)
  - Max passengers
  - Highlights (bullet points with check icons)
  - Base price + discounted price

**Step 2: Date & Duration**
- Calendar picker
- Duration selector (if package offers flexibility)
- Weather note box:
  - "☀️ Weather looks great for Sep 5!"
  - Or: "⛈️ High winds forecasted"

**Step 3: Passengers**
- Stepper for passenger count
- Warning if exceeding vessel capacity

**Step 4: Add-ons** (Optional)
- Checkboxes with prices:
  - Catering (₱2,000)
  - Professional Photographer (₱1,500)
  - Fishing Equipment (₱500)
  - Snorkeling Gear (₱300)
- Selected items add to total

**Step 5: Review**
- Package card
- Trip details (date, departure time, duration, passengers)
- Add-ons list
- Weather backup plan note
- Pricing breakdown (package + add-ons - discount = total)

**Step 6: Payment**
- Same 3 options as hotel booking
- If paying: Card/GCash/Maya forms

**Step 7: Success**
- ✅ "Cruise Booked!"
- Meeting point address
- "What to bring" checklist:
  - Sunscreen, Swimwear, Valid ID, Membership card
- "Get Directions" button
- "Contact Captain" button (WhatsApp link)

**Does NOT Have:**
- Real-time availability (merchant confirms)
- Weather API integration (just mock warnings)
- GPS tracking of vessel

---

### Screen 8: Booking Flow - Activities
**Purpose:** Book adventure activities (ziplines, safaris, theme parks)
**When:** Tap "Request Booking" from activity partner
**Format:** Bottom sheet modal

**Steps (7 total):**

**Step 1: Select Activity**
- Activity cards showing:
  - Image
  - Activity name (e.g., "Canopy Tour Package")
  - Duration
  - Requirements (min age, height, weight limits)
  - Included items (safety gear, guide, insurance)
  - Price

**Step 2: Date & Time Slot**
- Calendar
- Time slots (Morning 8-12, Afternoon 1-5, Full Day)
- Capacity indicators: "8 / 15 spots left"
- Sold out slots disabled

**Step 3: Participants**
- For each participant:
  - Name field
  - Age dropdown
  - Height field (cm or ft/in)
  - Weight field (kg or lbs)
- "Add Participant" button
- Validation against requirements (shows warnings if someone doesn't meet criteria)

**Step 4: Safety Waiver**
- Scrollable safety rules
- What to wear guidelines
- Health restrictions list
- Required checkboxes:
  - "I have read safety rules"
  - "Participants meet requirements"
  - "I agree to follow instructions"
  - "I waive liability"
  - "Age verification"
- Electronic signature field (type full name)
- Cannot proceed until all checked and signed

**Step 5: Review**
- Activity details
- Participants list
- What to bring checklist
- Meeting point with map
- Note: "Arrive 15 minutes early"
- Pricing (per person × count - discount = total)

**Step 6: Payment**
- Same options as hotel

**Step 7: Success**
- ✅ "Adventure Booked!"
- QR code for check-in
- "Show this at activity center"
- What to bring list
- Weather cancellation policy
- Emergency contact number
- "Get Directions" button

**Does NOT Have:**
- Digital waiver signing with stylus (just typed name)
- Medical form upload (simplified to checkboxes)
- Group booking discounts (fixed per-person pricing)

---

### Screen 9: My Pass
**Purpose:** Digital membership card, booking management, activity tracking
**When:** Tap "My Pass" in bottom nav

**Components:**

1. **Header**
   - Title: "My Pass"

2. **Digital Membership Card** (Prominent, tappable)
   - White background, rounded corners, shadow
   - Colored strip at top (tier-based color)
   - Subic.Life logo (top-left, small)
   - Tier badge (top-right): "ELITE MEMBER"
   - Member name (large, bold)
   - Member ID (small, monospace font)
   - Valid until date
   - Badges row:
     - Insurance badge: "₱1,000,000 Coverage"
     - Discount badge: "25% Discount"
     - Additional perks (if Elite: hotel night, yacht icons)
   - QR Code (center, 160px)
     - White padding/border around it
     - "Show to partner" text below
   - Refresh timer: "QR refreshes in 24s" with progress bar
   - QR regenerates every 30 seconds for security
   - "Tap to Fullscreen" button

3. **Fullscreen Card View** (Modal when card tapped)
   - Fixed overlay covering screen
   - Card enlarged, QR code bigger (240px)
   - Close X button (top-right)
   - Everything else same as normal card

4. **My Bookings Section**
   - Tabs: Upcoming | Pending | Past
   - Booking cards (vertical list):
     - Status badge (top-right): ✅ Confirmed, ⏳ Pending, ❌ Declined, ✓ Completed
     - Partner thumbnail (56px, rounded)
     - Booking details:
       - Partner name
       - Package/reservation type
       - Date and time
       - Booking reference (monospace, gray background)
     - Action buttons:
       - "View Details" (blue text)
       - "Get Directions" (if confirmed)
       - "Contact Partner" (phone icon)
       - "Cancel" (if pending/upcoming, red text)
   - Empty state (if no bookings):
     - Calendar icon (large, gray)
     - "No bookings yet"
     - "Start exploring" button

5. **Recent Activity Section** (Timeline)
   - Heading: "Recent Activity"
   - List items with vertical connector line:
     - Icon circle (colored background)
     - Activity text: "+500 points earned" or "Scanned at Lighthouse Marina"
     - Timestamp: "2 hours ago" (small, gray)

6. **Benefits Summary** (Expandable accordions)
   - "Insurance Coverage" → Shows policy details
   - "Partner Discounts" → Shows discount breakdown by tier
   - "Exclusive Perks" → Lists tier-specific benefits

**QR Code Logic:**
```
Format: "SL:{MEMBER_ID}:{TIMESTAMP}"
Example: "SL:MEM001234:1703012345678"
Regenerates every 30 seconds
Timer counts down visually
```

**Interactions:**
- Tap card → Open fullscreen view
- Tap booking → Navigate to booking detail page
- Tap "Get Directions" → Open maps
- Tap "Contact Partner" → Open phone/WhatsApp
- Tap "Cancel" → Show confirmation dialog
- Pull to refresh → Reload bookings

**Data Sources:**
- User data: Supabase `users` table
- Bookings: Supabase `bookings` table (joined with `partners`)
- Filtered by:
  - Upcoming: status='confirmed' AND date > today
  - Pending: status='pending'
  - Past: status='completed' OR date < today

**Does NOT Have:**
- Payment history (that's in Profile/Settings)
- Membership upgrade flow (that's in Profile)
- QR code manual refresh button (auto-refreshes)

---

### Screen 10: Concierge
**Purpose:** AI-powered chat assistant for discovery and booking
**When:** Tap "Concierge" in bottom nav
**Note:** This uses REAL OpenAI GPT-4 with a live API key and comprehensive knowledge base (not pattern matching or mocked responses)

**Components:**

1. **Header**
   - Title: "Concierge"
   - Status indicator: Green dot + "Online"
   - Menu icon (three dots, opens settings)

2. **Search Bar** (Top)
   - Large input: "What can I help you find?"
   - Search icon left
   - Rounded, shadow

3. **Quick Action Chips** (Below search, horizontal scroll)
   - "Find dinner spot"
   - "Book yacht"
   - "Plan day trip"
   - "Best diving"
   - "Weekend getaway"
   - Tap chip → Auto-fills and sends query

4. **Chat Messages Area** (Scrollable)
   - User messages: Right-aligned, blue background, white text, rounded
   - AI messages: Left-aligned, white background, gray text, shadow, rounded
   - AI avatar: Circle with bot icon, blue background
   - Timestamp below each message (small, gray)

5. **AI Response Types:**
   
   a. **Text Response** (Simple answer)
   - Plain text message

   b. **Venue Card** (Attached to AI message)
   - White card below text
   - Image (4:3 ratio, rounded top)
   - Content area:
     - Venue name (semibold)
     - Category + rating (small, gray)
     - Discount badge (green, "25% OFF")
     - Price: "From ₱3,500"
     - "Book Now" button (blue, full width)

   c. **Multiple Options** (Horizontal scroll)
   - 2-3 venue cards (smaller, 240px wide each)
   - User swipes to see all

   d. **Booking Confirmation Card**
   - Appears after user says "book it"
   - Shows: Venue, date/time, price
   - "Confirm Booking" button (green)
   - "Modify" button (border only)

6. **Loading State**
   - Three dots bouncing animation
   - Gray background, rounded
   - Appears on left side while AI "thinks"

7. **Input Bar** (Sticky bottom)
   - Full width, white background, shadow
   - Input field: Rounded, border, "Ask your concierge..."
   - Send button: Circular, blue (disabled if input empty)
   - Auto-focus when page loads

**AI Personality:**
- Helpful and enthusiastic but professional
- Uses member's first name naturally
- Acknowledges tier: "As an Elite member, you'll get 25% off!"
- Proactive: "Since you enjoyed X, you might like Y..."
- Specific to Subic Bay context (never generic)

**Example Conversation Flow:**
```
User: "Find me a nice place for dinner tonight"
AI: "I'd love to help! Any preferences? Cuisine type, price range, vibe?"
User: "Seafood, waterfront, romantic"
AI: "Perfect! Here are my top picks:"
[Shows 3 venue cards]
User: [Taps "Book Now" on Lighthouse Marina]
AI: "Great choice! Let's book Lighthouse Marina Resort."
[Shows booking form card with date/time/party size]
User: [Fills and taps "Confirm"]
AI: "✅ Booking request sent! They'll confirm within 2 hours."
[Shows booking confirmation card with reference number]
```

**OpenAI Integration:**
- Uses OpenAI GPT-4 API with custom system prompts
- Context includes:
  - User profile (name, tier, preferences from onboarding quiz)
  - Partner database (all available hotels, restaurants, activities, yachts)
  - User's booking history (past trips, favorites)
  - Current Subic Bay information (weather, events, availability)
- System prompt includes:
  - Personality guidelines (professional, helpful, local expert)
  - Response format rules (when to show venue cards, booking forms)
  - Discount awareness (knows user's tier and applicable discounts)
  - Booking flow integration (can initiate bookings inline)
- Temperature: 0.7 (balanced creativity and consistency)
- Max tokens: 500 per response (concise but complete)
- Streaming: Yes (responses appear word-by-word)

**Data Actions:**
- Each message sent to OpenAI includes:
  ```typescript
  {
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `You are a helpful concierge for Subic.Life, a premium travel membership platform...
        
        User Info:
        - Name: ${user.name}
        - Tier: ${user.tier} (${user.discount}% discount)
        - Preferences: ${user.onboarding_preferences}
        
        Available Partners:
        ${JSON.stringify(partners)}
        
        Instructions:
        - Be helpful, enthusiastic but professional
        - Use user's first name naturally
        - Acknowledge their membership tier and applicable discounts
        - When recommending venues, return in this format: [VENUE_CARD:{partner_id}]
        - When user wants to book, return: [BOOKING_FORM:{partner_id}]
        - Keep responses concise (under 100 words unless asked for details)
        - Focus on Subic Bay establishments only
        `
      },
      ...conversationHistory,
      {
        role: "user",
        content: userMessage
      }
    ],
    temperature: 0.7,
    max_tokens: 500,
    stream: true
  }
  ```

- Parse AI response for special tags:
  - `[VENUE_CARD:partner_id]` → Fetch partner and render venue card
  - `[BOOKING_FORM:partner_id]` → Open booking flow for that partner
  - `[MULTIPLE_OPTIONS:id1,id2,id3]` → Show horizontal scroll of venues

- When user confirms booking via concierge:
  - Creates booking in Supabase
  - Awards points
  - AI confirms: "✅ Booking request sent! Reference: #SL-2024-1234"
  
- Conversation history stored in `concierge_messages` table
- OpenAI API key stored in environment variables (OPENAI_API_KEY)

**Does NOT Have:**
- Voice input/output (text only)
- Image recognition (text queries only)
- Multi-language support (English only)
- Conversation export
- Video calls or screen sharing

---

### Screen 11: Profile / Settings
**Purpose:** Account management, preferences, payment methods
**When:** Tap "Profile" in bottom nav

**Components:**

1. **Header Section**
   - Large avatar (96px, circular, centered)
   - User name below (large, bold)
   - "Member since" date (small, gray)
   - "Edit Profile" button (border, rounded)

2. **Tier Card**
   - White background, rounded, shadow
   - Tier badge (top-left, colored)
   - Current tier name (large, semibold)
   - Benefits list:
     - Insurance amount
     - Discount percentage
     - Points balance
     - Special perks (if applicable)
   - "Upgrade Tier" button (blue, full width)
   - If already Elite: "You're at the highest tier! 🎉"

3. **Account Section**
   - Heading: "Account" (small, uppercase, gray)
   - List items (each with icon left, label center, chevron right, border between):
     - Personal Information (User icon)
     - Payment Methods (CreditCard icon)
     - Booking History (Calendar icon)
     - Favorites (Heart icon)
     - Points & Rewards (Award icon)

4. **Preferences Section**
   - Heading: "Preferences"
   - List items:
     - Notifications (Bell icon) → Toggle switch right
     - Language (Globe icon) → "English" with chevron
     - Currency (DollarSign icon) → "PHP ₱" with chevron
     - Dark Mode (Moon icon) → Toggle switch right

5. **Support Section**
   - Heading: "Support"
   - List items:
     - Help Center (HelpCircle icon)
     - Contact Us (MessageCircle icon)
     - Terms of Service (FileText icon)
     - Privacy Policy (Shield icon)
     - Rate App (Star icon)

6. **Logout Button**
   - Full width, margin top
   - Border (2px, red), text red
   - Rounded, height 48px
   - "Logout" text with LogOut icon
   - Shows confirmation dialog on tap

7. **App Info Footer**
   - Version: "v1.0.0"
   - Copyright: "© 2024 Subic.Life"
   - Links: Terms | Privacy
   - Small, gray, center-aligned

**Sub-Pages:**

**Personal Information:**
- Fields (all editable except email):
  - Full name
  - Email (read-only, verified badge)
  - Phone
  - Birthday (read-only after first set)
  - Address
- "Save Changes" button (blue)

**Payment Methods:**
- Card list showing:
  - Logo (Visa/MC/GCash/Maya)
  - Last 4 digits
  - Expiry date
  - "Default" badge on one
  - "Set as Default" button
  - "Remove" button (red text)
- "Add Payment Method" button (blue, + icon)

**Add Payment Modal:**
- Tabs: Credit Card | GCash | Maya
- Card form: Number, Expiry, CVV, Name
- "Add Card" button
- "Save for future bookings" toggle
- Note: Cards are stored but not charged (demo only)

**Interactions:**
- Tap list item → Navigate to sub-page
- Toggle switches → Update immediately (optimistic UI)
- "Upgrade Tier" → Navigate to /membership page
- "Logout" → Show "Are you sure?" dialog → Clear session → Go to welcome page

**Data Sources:**
- User profile: Supabase `users` table
- Payment methods: Supabase `payment_methods` table (or local storage for demo)

**Does NOT Have:**
- Two-factor authentication settings
- Social media account linking (login only, not profile display)
- Referral program
- Delete account option (contact support for this)

---

## Merchant Portal (Business-Facing)

### Screen M1: Merchant Login
**Purpose:** Authentication for merchant staff
**When:** Navigate to /portal or /merchant

**Components:**
- Centered card on gray background
- Subic.Life logo/icon
- Heading: "Partner Login"
- Subtitle: "Access your merchant dashboard"
- Email input field
- Password input field (with show/hide toggle)
- "Remember me" checkbox
- "Sign In" button (blue, full width)
- "Forgot password?" link
- Demo credentials hint box:
  - Blue background, border
  - Text: "Demo: demo@subic.life / demo123"
  - Small, monospace font

**Demo Login Logic:**
- Accepts: demo@subic.life / demo123
- Creates session in localStorage
- Session includes: email, partner_ids=['all'], name='Demo Account'
- Redirects to /portal/dashboard

**Does NOT Have:**
- Registration (merchants are added by admin)
- Social login (email/password only)
- Password reset flow (contact support)
- Multi-factor authentication

---

### Screen M2: Merchant Dashboard
**Purpose:** Overview of bookings, metrics, requests
**When:** After login, default merchant view

**Components:**

1. **Header** (Sticky)
   - Left: Partner logo (48px) + name + category
   - If demo account: Dropdown selector showing:
     - Current partner with chevron
     - Dropdown list: All partners (Lighthouse Marina, La Banca Cruises, Zoobic Safari, etc.)
     - Selected partner has checkmark
   - Right: Notification bell (red dot if unread) + Logout button

2. **Metrics Cards** (4-column grid, 2-column on mobile)
   - Card structure: White bg, rounded, border, padding
   - Icon: Colored circle (48px) with white icon inside
   - Value: Large number (text-3xl)
   - Label: Small text (text-sm, gray)
   
   Cards:
   1. **New Requests**
      - Icon: Calendar (blue circle)
      - Value: 3 (with 🔴 badge if >0)
      - Label: "New Requests"
   
   2. **Confirmed Today**
      - Icon: CheckCircle (green circle)
      - Value: 5
      - Label: "Confirmed Today"
   
   3. **Expected Arrivals**
      - Icon: Users (orange circle)
      - Value: 8
      - Label: "Expected Arrivals"
   
   4. **Revenue (Today)**
      - Icon: DollarSign (purple circle)
      - Value: ₱45,000
      - Label: "Revenue (Today)"

3. **Booking Requests Section**
   - Heading: "Booking Requests" with "View All" link
   - Request cards (vertical stack, max 3 shown):
     
     **Request Card Structure:**
     - White bg, rounded, border-left (4px, blue), shadow
     - NEW badge: Blue bg, white text, uppercase, small
     - Header row:
       - Left: Avatar (40px) + Name + Tier badge + timestamp
       - Right: Close/dismiss X (optional)
     - Booking details:
       - Package/type (semibold)
       - Date range or time
       - Guests count
       - Special requests (gray, italic)
     - Revenue section (border-top):
       - Label: "Revenue Impact"
       - Package price: ₱12,000
       - Member discount: -₱3,000 (red)
       - Subtotal: ₱9,000 (green)
       - Commission: -₱900 (gray)
       - Your net: ₱8,100 (large, bold)
     - Action buttons (flex row, gap):
       - "Accept" (flex-1, green bg, white text, Check icon)
       - "Counter-Offer" (flex-1, border, gray text)
       - "Decline" (w-10 h-10, border, X icon only)

4. **Recent Bookings Section**
   - Table or cards showing:
     - Booking reference (monospace)
     - Member name + tier badge
     - Package/service
     - Date
     - Status badge (colored)
     - Amount
     - "View" link
   - Empty state if no bookings:
     - Icon (large, gray)
     - "No bookings yet"
     - "New requests will appear here"

**Partner Switcher Logic:**
```typescript
// Demo account sees all partners
partners = [Lighthouse Marina, La Banca Cruises, Zoobic Safari, ...]

// On switch:
setCurrentPartner(selectedPartner)
reloadDashboardData(selectedPartner.id)
```

**Realtime Updates:**
```typescript
// Subscribe to new bookings
supabase
  .channel('merchant-bookings')
  .on('postgres_changes', {
    event: 'INSERT',
    table: 'bookings',
    filter: `partner_id=eq.${currentPartnerId}`
  }, (payload) => {
    showNotification('New booking request!')
    prependToBookingsList(payload.new)
  })
```

**Interactions:**
- Click partner dropdown → Show partner list → Select → Reload data
- Click "Accept" → Open accept confirmation modal
- Click "Counter-Offer" → Open counter-offer form modal
- Click "Decline" → Open decline reason modal
- Notification bell → Show notifications panel
- Auto-refresh data every 30 seconds

**Does NOT Have:**
- Calendar view of bookings (list view only)
- Drag-and-drop scheduling
- Team member management
- Live chat with customers

---

### Screen M3: Booking Detail & Actions Modal
**Purpose:** View full booking details and take action
**When:** Click on a booking request card

**Format:** Modal overlay or full-screen on mobile

**Components:**

1. **Member Information Card**
   - Avatar (64px)
   - Member name (large, bold)
   - Tier badge (large, prominent)
   - "Member since" date
   - "Total bookings" count
   - "View Profile" link
   - Trust badges:
     - ✅ "Verified member" (green checkmark)
     - 🛡️ "Elite status" badge
     - "₱1M insurance coverage" (shield icon)

2. **Booking Details Section**
   - Heading: "Booking Request"
   - Details grid (2 columns on desktop, 1 on mobile)
   - Each field: Label (small, uppercase, gray) + Value (base, black)
   
   **Fields vary by type:**
   - **Hotels:** Check-in date/time, Check-out date/time, Room type, Guests (adults+children), Special requests, Booking reference, Request timestamp
   - **Restaurants:** Reservation date, Time slot, Party size, Dietary restrictions, Special occasion, Special requests
   - **Yachts:** Date, Departure time, Duration, Passengers, Package name, Add-ons, Special requests
   - **Activities:** Date, Time slot, Participants (with names/ages), Package, Equipment needed, Waiver status

3. **Pricing Breakdown Card** (Border, rounded)
   - Base Price: ₱12,000
   - Member Discount (25%): -₱3,000 (with tier shown)
   - Add-ons (if any): +₱X,XXX
   - Subtotal: ₱9,000
   - Subic.Life Commission (10%): -₱900
   - **Your Net Revenue:** ₱8,100 (large, bold, green)

4. **Payment Status Badge**
   - "Paid Online" (green) if user paid
   - "Deposit Paid (₱2,000)" (yellow) if partial
   - "Pay on Arrival" (gray) if deferred

5. **Special Requests Highlight** (If present)
   - Yellow/orange left border box
   - AlertCircle icon
   - Request text (readable size)
   - "Important" tag if flagged

6. **Action Buttons** (Full-width stack on mobile, row on desktop)
   - **Accept:** bg-green-600, white text, h-12, CheckCircle icon, "Accept Booking"
   - **Counter-Offer:** border-2 blue-500, blue text, h-12, Edit icon, "Send Counter-Offer"
   - **Decline:** border-2 red-500, red text, h-12, XCircle icon, "Decline Request"

**Action Modals:**

**Accept Confirmation:**
```
Title: "Confirm this booking?"
Content:
- Booking summary
- "Room/table to assign:" dropdown (optional)
- "Add internal note:" textarea (optional)
- "Member will be notified immediately"
Buttons: Cancel (gray) | Confirm Booking (green)
```

**Counter-Offer:** (Opens appropriate form - see Screen M4)

**Decline:**
```
Title: "Decline this booking?"
Content:
- "Reason for decline:" dropdown
  Options: Fully booked, Room/service unavailable, Date not available, Does not meet requirements, Other
- "Explanation for guest:" textarea (required, shown to member)
- "Member will be notified and can try different dates"
Buttons: Cancel | Decline Booking (red)
```

**Data Actions:**
```typescript
// Accept
await supabase.from('bookings')
  .update({ status: 'confirmed', confirmed_at: now() })
  .eq('id', bookingId)

await supabase.from('notifications').insert({
  user_id: booking.user_id,
  type: 'booking_confirmed',
  title: 'Booking Confirmed!',
  message: `Your booking at ${partnerName} is confirmed`
})

await supabase.rpc('add_points', { user_id, points: 500 })

// Decline
await supabase.from('bookings')
  .update({ 
    status: 'declined',
    decline_reason: reason,
    decline_explanation: explanation
  })
  .eq('id', bookingId)
```

**Does NOT Have:**
- Edit booking details (member must rebook)
- Direct messaging with member (use contact button)
- Print booking receipt

---

### Screen M4: Counter-Offer Forms (5 Industry Types)
**Purpose:** Suggest alternative dates/packages when can't fulfill exact request
**When:** Click "Counter-Offer" from booking detail
**Format:** Modal

**General Structure (All Types):**
- Heading: "Send Counter-Offer"
- Subheading: "Suggest an alternative that works better"
- Original request summary (gray box)
- Counter-offer fields (vary by industry)
- Merchant note field (always present, required)
- Preview box showing what member will see
- Buttons: Cancel | Send Counter-Offer (blue)

**Type 1: Hotels Form**

Fields:
- [ ] Suggest different check-in: Date picker (toggle to enable)
- [ ] Suggest different check-out: Date picker (toggle to enable)
- Alternative room type: Dropdown (Standard Ocean View, Deluxe Garden View, Suite)
- Adjust price: ₱ input (optional)
- Sweeteners (checkboxes):
  - ☐ Free breakfast included
  - ☐ Room upgrade on day 2
  - ☐ Late checkout (2 PM)
  - ☐ Welcome drink voucher
- Merchant note: Textarea, h-24, required
  - Placeholder: "We're fully booked on Dec 25, but we can upgrade you to a suite on Dec 26 at the same price..."

**Type 2: Restaurants Form**

Fields:
- [ ] Suggest different date: Date picker
- [ ] Suggest different time: Time slot dropdown (30min intervals)
- Suggest different table location: Radio buttons (Indoor, Outdoor patio, Private dining room +₱1,000)
- Include complimentary (checkboxes):
  - ☐ Complimentary appetizer
  - ☐ Complimentary dessert
  - ☐ Birthday cake
  - ☐ Bottle of wine
- Merchant note: Textarea

**Type 3: Activities Form**

Fields:
- [ ] Suggest different date: Date picker
- [ ] Suggest different time slot: Radio (Morning 8-12, Afternoon 1-5, Full day 8-5)
- Suggest different package: Dropdown (Basic Tour, Adventure Package, VIP Experience)
- Price per person: ₱ input
- Include add-ons (checkboxes):
  - ☐ Professional photos included
  - ☐ Lunch provided
  - ☐ Transportation from hotel
  - ☐ Souvenir T-shirt
- Merchant note: Textarea

**Type 4: Yachts/Water Sports Form**

Fields:
- [ ] Suggest different date: Date picker (with weather indicator)
- [ ] Suggest different time: Time picker (shows sunset time for reference)
- Suggest different duration: Radio (2hr, 3hr +₱2K, 4hr +₱4K, Full day custom)
- Suggest different vessel: Dropdown (Yacht A 20pax, Yacht B 30pax, Speedboat 10pax)
- Adjust inclusions (checkboxes):
  - ☐ Premium catering upgrade
  - ☐ Professional photographer
  - ☐ DJ/music system
  - ☐ Snorkeling equipment
- Price adjustment: ₱ input
- Weather backup date: Date picker (optional)
- Merchant note: Textarea

**Type 5: Insurance/Services Form**

Simplified (no counter-offer, just approve/decline):
- If decline:
  - Reason dropdown: (Eligibility issue, Coverage limit, Documentation required, Service not available)
  - Explanation: Textarea (required)
  - Next steps for member: Text input (optional)

**Preview Box (All Forms):**
Shows exactly what member will see:
```
Blue background box:
"Counter-Offer Received"
Your request: [original details]
Merchant suggests: [counter-offer details]
Merchant's note: [note text]
[Accept Offer] [Decline] buttons
```

**Data Action:**
```typescript
await supabase.from('counter_offers').insert({
  booking_id: bookingId,
  partner_id: partnerId,
  offer_details: formData,
  merchant_note: note,
  status: 'pending'
})

await supabase.from('bookings')
  .update({ status: 'counter_offer_sent' })
  .eq('id', bookingId)

await supabase.from('notifications').insert({
  user_id: booking.user_id,
  type: 'counter_offer',
  title: 'Counter-Offer Received',
  message: `${partnerName} has a suggestion for your booking`
})
```

**Validation:**
- At least one field must differ from original
- Merchant note minimum 20 characters
- Prices must be reasonable (within 50% of original)
- Dates must be valid (not in past)

**Does NOT Have:**
- Multiple counter-offers per booking (one at a time)
- Negotiate back-and-forth (member accepts or declines)
- Auto-suggested alternatives (manual entry only)

---

### Screen M5: QR Code Scanner
**Purpose:** Verify member identity and check-in guests
**When:** Navigate to /portal/scan OR tap "Scan QR" from dashboard
**Format:** Fullscreen camera view

**Components:**

1. **Scanner View** (Initial state)
   - Fullscreen camera feed
   - Video uses device rear camera
   - Dark overlay (black/60 opacity)
   - Transparent center square (280×280px, border-4 white, rounded-2xl)
   - Corner brackets on scan frame (white, animated pulse)
   - Instruction text (top-center): "Point camera at member's QR code" (white, drop-shadow)
   - Cancel button (top-left): X icon, white, bg-black/50, circular, w-10 h-10
   - Flashlight toggle (top-right): Flashlight icon, white, bg-black/50, circular, w-10 h-10
   - Horizontal scan line (animated, sweeps down frame repeatedly)

2. **Scanning Animation**
   - Line: h-1, bg-white, shadow-lg
   - Animates top to bottom continuously

3. **Verification Result** (After successful scan)
   - Camera freezes
   - Bottom sheet slides up (white, rounded-t-3xl, shadow-2xl)
   - Drag indicator at top

**Success Result:**

a. **Checkmark Icon**
   - Large (64px), green-500
   - Centered, animate scale-in

b. **Member Card**
   - Avatar (80px, center)
   - Member name (text-2xl font-bold)
   - Tier badge (large, prominent, colored)
   - Member ID (text-sm font-mono gray)
   - Valid until date

c. **Status Indicators** (Row of badges)
   - ✅ "Valid Member" (green)
   - 🛡️ "Insurance: ₱1,000,000" (blue)
   - 🎟️ "25% Discount" (green)

d. **If Pre-Confirmed Booking Found:**
   - Border-top section
   - "Confirmed Booking" heading (text-lg font-bold)
   - Booking reference: #SL-2024-1234
   - Package name
   - Dates/time
   - Guests count
   - Payment status: "Paid online - ₱9,000"
   - Special requests (if any)
   - "Check In" button: w-full h-14 bg-green-600 text-white rounded-xl
   - "View Full Details" button: w-full border mt-2

e. **If No Booking Found:**
   - Info box: bg-yellow-50 border-l-4 border-yellow-400
   - "No confirmed booking found for today"
   - "Member can still receive discount by paying at desk"
   - "Apply Discount" button: Opens discount calculator
   - "Close" button

**Error Result:**
   - ❌ Red X icon (large)
   - "Invalid QR Code" or "Member Not Found"
   - "Please try scanning again"
   - "Scan Again" button (blue)

**Discount Calculator Modal** (If no booking):
```
Title: "Calculate Member Discount"
- Bill amount input: ₱ [input]
- Member tier discount: 25% (auto-shown)
- Discount amount: -₱[calculated] (red)
- Final amount: ₱[calculated] (large, bold)
- "Discount applied: ₱X saved" (green box)
- "Confirm & Close" button
```

**Scanner Implementation:**
```typescript
import { Html5Qrcode } from "html5-qrcode"

const scanner = new Html5Qrcode("qr-reader")

scanner.start(
  { facingMode: "environment" },
  { fps: 10, qrbox: { width: 280, height: 280 } },
  async (decodedText) => {
    scanner.stop()
    
    // Parse: "SL:MEMBER_ID:TIMESTAMP"
    const [prefix, memberId, timestamp] = decodedText.split(':')
    
    if (prefix !== 'SL') {
      showError('Invalid format')
      return
    }
    
    // Verify member
    const { data: member } = await supabase
      .from('users')
      .select('*')
      .eq('member_id', memberId)
      .single()
    
    // Check for today's booking
    const { data: booking } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', member.id)
      .eq('partner_id', currentPartnerId)
      .eq('status', 'confirmed')
      .single()
    
    showVerificationResult({ member, booking })
  }
)
```

**Check-In Action:**
```typescript
await supabase.from('bookings')
  .update({
    status: 'completed',
    checked_in_at: new Date()
  })
  .eq('id', bookingId)

await supabase.rpc('add_points', {
  user_id: member.id,
  points: 100
})

showSuccessToast('Guest checked in!')
```

**Camera Permissions:**
```typescript
const requestCamera = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ 
      video: { facingMode: 'environment' } 
    })
    stream.getTracks().forEach(track => track.stop())
    startScanning()
  } catch (error) {
    showError('Camera permission denied. Enable in settings.')
  }
}
```

**Does NOT Have:**
- Front camera option (rear only for scanning)
- Manual member ID entry field (scan only)
- Bulk check-in (one at a time)
- Photo capture for verification

---

### Screen M6: Settings & Analytics
**Purpose:** View performance metrics, configure account settings
**When:** Navigate to /portal/settings OR tap Settings from dashboard
**Format:** Tabbed interface

**Tabs:** Analytics | Settings | Profile

---

**Tab 1: Analytics**

**Metrics Cards** (Same style as dashboard, 4 cards)
1. Total Revenue: ₱245,000 (+12% trend, green UpArrow)
2. Total Bookings: 89 (+5 from last month)
3. Avg Booking Value: ₱2,753 (+8%)
4. Acceptance Rate: 94% (same as last month, gray)

**Revenue Chart**
- Card with border, white bg
- Heading: "Revenue (Last 30 Days)"
- Bar chart (Recharts library):
  - X-axis: Days (1, 5, 10, 15, 20, 25, 30)
  - Y-axis: Revenue (₱0 - ₱20k, formatted as "₱10k")
  - Bars: Blue (#135bec), rounded tops
  - Hover tooltip: Exact amount + date

Sample Data:
```typescript
const revenueData = [
  { day: '1', revenue: 8500 },
  { day: '5', revenue: 12000 },
  { day: '10', revenue: 9800 },
  { day: '15', revenue: 15200 },
  { day: '20', revenue: 11000 },
  { day: '25', revenue: 18500 },
  { day: '30', revenue: 14200 }
]
```

**Booking Status Breakdown**
- Pie or donut chart
- Segments:
  - Confirmed: 75 (green)
  - Pending: 8 (yellow)
  - Declined: 6 (red)
  - Completed: 89 (gray)

**Top Services/Packages**
- Table or list:
  - Package name
  - Bookings count
  - Revenue
  - Horizontal bar showing relative popularity

Example:
```
Weekend Getaway    24 bookings  ₱108,000  [████████░░]
Romantic Dinner    18 bookings  ₱81,000   [██████░░░░]
Day Tour           15 bookings  ₱37,500   [█████░░░░░]
```

**Export Button**
- "Export Report" button (blue)
- Generates PDF or CSV download

**Date Range Selector** (Top-right)
- Dropdown: "Last 7 days", "Last 30 days", "Last 3 months", "This year"
- All charts/metrics update based on selection

---

**Tab 2: Settings**

**Merchant Profile Section**
- Heading: "Merchant Profile"
- Fields (all editable):
  - Business name (text input)
  - Category (dropdown: hotels, restaurants, activities, water-sports, services)
  - Contact email (email input)
  - Contact phone (tel input)
  - WhatsApp number (tel input, for notifications)
  - Business address (textarea)
  - Business hours:
    - Each day (Mon-Sun): Open time / Close time pickers
    - Toggle for closed days
  - Website URL (url input)
  - Description (textarea, h-32)
  - Logo upload (drag-drop or click, shows preview)
- "Save Changes" button (blue, h-12)

**Discount Settings**
- Standard discount: % input (applies to Basic/Premium members)
- Elite discount: % input (applies to Elite members)
- "Apply to all future bookings" checkbox

**Booking Settings**
- **Auto-accept bookings:** Toggle switch
  - "Automatically accept bookings that meet criteria"
  - Criteria checkboxes (only if toggle ON):
    - ☐ Payment received online
    - ☐ Member tier: Elite or Premium
    - ☐ Available capacity
    - ☐ Within business hours
- **Booking window:** "Accept bookings up to [input] days in advance"
- **Cancellation policy:** Dropdown (Flexible, Moderate 48h, Strict no refunds)
- **Response time target:** Dropdown (1 hour, 2 hours, 4 hours, 24 hours)

**Notification Preferences**
- Checkboxes:
  - ☑ New booking requests (email)
  - ☑ New booking requests (WhatsApp)
  - ☑ Payment received
  - ☑ Member check-in
  - ☐ Daily summary report
  - ☐ Weekly performance report

**WhatsApp Integration**
- "Forward bookings to WhatsApp: +63 [input]"
- Toggle: Enabled/Disabled
- "Send Test Message" button (sends sample booking notification)

**Save Changes Button** (Bottom, blue, full-width)

---

**Tab 3: Profile**

**Staff Account**
- Heading: "Staff Account"
- Name (text input)
- Email (read-only, gray)
- Role (dropdown: Owner, Manager, Staff)

**Change Password Section**
- Heading: "Change Password"
- Current password (password input)
- New password (password input)
- Confirm password (password input)
- Password requirements note: "Minimum 8 characters"
- "Update Password" button (blue)

**Team Management** (If applicable)
- Heading: "Team Members"
- List of staff accounts:
  - Avatar, name, role, email
  - "Edit" button (opens edit modal)
  - "Remove" button (red, shows confirmation)
- "Add Staff Member" button (blue, + icon)
  - Opens modal with: Name, Email, Role fields

**Logout**
- "Logout" button (red border, text red, full-width, bottom)
- Shows confirmation dialog: "Are you sure you want to logout?"

---

**Data Sources:**
```typescript
// Analytics
const { data: analytics } = await supabase
  .rpc('get_partner_analytics', {
    partner_id: currentPartnerId,
    start_date: dateRange.start,
    end_date: dateRange.end
  })

// Or manual queries
const { data: bookings } = await supabase
  .from('bookings')
  .select('*')
  .eq('partner_id', currentPartnerId)
  .gte('created_at', startDate)
  .lte('created_at', endDate)

// Update settings
await supabase.from('partners')
  .update({
    discount_percentage: standardDiscount,
    elite_discount_percentage: eliteDiscount,
    notification_preferences: notificationSettings
  })
  .eq('id', partnerId)
```

**Does NOT Have:**
- A/B testing settings
- Custom branding options (uses platform branding)
- Integration with POS systems
- Financial reports beyond basic revenue (no tax reports)

---

## Summary: Complete Screen Inventory

### User App (12 Screens)
1. Onboarding Quiz (optional, 3 questions)
2. Package Upgrade Offer (after quiz, presents Basic/Premium/Elite)
3. Home Dashboard (main hub)
4. Partners Discovery (browse, search, filter)
5. Partner Detail (full info, booking CTA)
6. Hotel Booking Flow (7 steps)
7. Restaurant Booking Flow (5 steps)
8. Yacht Booking Flow (7 steps)
9. Activity Booking Flow (7 steps)
10. My Pass (digital card, bookings, activity)
11. Concierge (AI chat with visual cards)
12. Profile/Settings (account, preferences)

### Merchant Portal (6 Screens)
1. Login (authentication)
2. Dashboard (metrics, requests, partner switcher)
3. Booking Detail & Actions (view, accept, counter, decline)
4. Counter-Offer Forms (5 industry types)
5. QR Scanner (verify members, check-in)
6. Settings & Analytics (3 tabs: analytics, settings, profile)

**Total: 18 unique screens/flows**

---

# User Flows

## Flow 1: New User Onboarding → First Booking

**Actors:** Tourist Maria (first-time visitor to Subic Bay)

**Steps:**
1. Maria downloads Subic.Life app OR visits subic.life website
2. Sees welcome screen with "Get Started" button
3. Taps "Get Started" → Registration screen
4. Enters: Name, Email, Phone, Birthday, Password
5. Pays ₱150 for Registration tier (demo: instant, no real payment)
6. Verifies email (clicks link in email)
7. **Optional:** Completes onboarding quiz (3 questions about her trip)
8. Sees Package Upgrade Offer screen (Basic ₱550, Premium ₱5,500, Elite ₱25,500)
9. Taps "Maybe Later" (stays on Registration tier)
10. Lands on Home Dashboard
11. Sees tier: REGISTRATION (5% discount, ₱25K insurance)
12. Browses Featured Offers, sees "30% OFF Yacht Charter"
13. Taps deal card → Partner Detail page for La Banca Cruises
14. Reviews images, reads about Sunset Cruise package
15. Taps "Request Booking" → Booking flow opens (bottom sheet)
16. Completes booking steps:
    - Selects date (tomorrow)
    - Chooses Sunset Cruise package (2 hours)
    - Enters passengers (4 people)
    - Adds catering add-on (+₱2,000)
    - Reviews booking summary
    - Selects "Pay deposit now" (₱2,000)
    - Enters GCash number
    - Submits request
17. Success screen: "Booking Request Sent!" with reference #SL-2024-1234
18. Maria receives confirmation email
19. Notification bell shows red dot
20. After 30 minutes: Push notification "Your booking is confirmed!"
21. Maria opens app → Goes to My Pass → Sees booking under "Upcoming"
22. Day of cruise: Shows QR code at La Banca marina
23. Staff scans QR → Verifies Maria is on Registration tier
24. Maria pays ₱6,375 (with 5% Registration discount)
25. After trip: +500 points added to account
26. Maria now has 1,500 points (needs 3,500 more for Basic tier)

**Alternative Path 1: Using Concierge**
- Step 12: Instead of browsing, taps "Concierge" tab
- Types: "I want to book a yacht for sunset tomorrow"
- AI responds with La Banca Cruises suggestion + card
- Taps "Book Now" on card → Rest of flow same

**Alternative Path 2: Searching**
- Step 12: Taps "Discover" tab
- Types "yacht" in search bar
- Filters results, finds La Banca Cruises
- Rest of flow same

**Alternative Path 3: Upgrading During Booking**
- Step 8: Maria sees upgrade offer, taps "Upgrade to Premium"
- Pays ₱5,500 (demo: instant upgrade)
- Now has 15% discount instead of 5%
- Continues with booking, saves even more

---

## Flow 2: Merchant Accepts Booking

**Actors:** 
- Maria (user, made booking request)
- Juan (staff at La Banca Cruises)

**Steps:**
1. Maria submits booking request (see Flow 1, step 13-14)
2. Supabase creates booking record (status: 'pending')
3. Supabase creates notification for La Banca Cruises
4. **Realtime:** Juan's merchant portal receives notification (Supabase subscription)
5. Juan's screen: Dashboard shows "🔴 NEW REQUEST" badge on metrics
6. Juan taps notification or clicks booking card
7. Booking Detail modal opens:
   - Shows Maria's info: Name, Registration tier, Member since
   - Booking details: Tomorrow, 4:30 PM, 4 passengers, Sunset Cruise
   - Special request: "Need life jackets for 2 kids"
   - Revenue breakdown:
     - Package: ₱8,500
     - Catering add-on: ₱2,000
     - Subtotal: ₱10,500
     - Registration discount (5%): -₱525
     - Net after discount: ₱9,975
     - Commission (10%): -₱997.50
     - **Juan's net revenue: ₱8,977.50**
   - Payment status: "Deposit paid ₱2,000, balance ₱7,975 on arrival"
8. Juan checks yacht availability (looks at calendar, yacht is free)
9. Juan checks life jacket inventory (has plenty for kids)
10. Juan taps "Accept Booking" button
11. Confirmation modal: "Confirm this booking?"
    - Juan enters internal note: "Assign Captain Rodriguez, prepare 2 child life jackets"
12. Juan taps "Confirm Booking"
13. Supabase updates booking status: 'confirmed'
14. Supabase creates notification for Maria
15. **Realtime:** Maria's app receives update (Supabase subscription)
16. Maria sees notification: "✅ Your booking at La Banca Cruises is confirmed!"
17. Maria opens notification → Booking card now shows "CONFIRMED" badge
18. Maria receives confirmation email with details
19. Juan's dashboard updates: "Expected Arrivals" increases by 4
20. Revenue forecast updates: +₱8,977.50
21. Day of cruise: Juan opens QR Scanner on tablet
22. Maria arrives, shows QR code
23. Juan scans → Maria's profile appears with booking details
24. Juan taps "Check In"
25. Booking marked "Completed"
26. Maria's account: +500 points added automatically
27. Juan's dashboard: "Revenue (Today)" increases by ₱8,977.50

**Alternative Path 1: Counter-Offer**
- Step 10: Juan realizes 4:30 PM is already booked
- Juan taps "Counter-Offer" button
- Opens counter-offer form (Yacht type)
- Juan suggests:
  - Different time: 5:30 PM (still catches sunset)
  - Same package, same price
  - Adds: "Free upgrade to premium catering"
  - Merchant note: "4:30 PM is booked, but 5:30 PM departure also catches full sunset. Premium catering included as apology!"
- Juan taps "Send Counter-Offer"
- Maria receives notification: "Counter-Offer Received"
- Maria opens booking, sees suggestion
- Maria taps "Accept Offer"
- Booking confirmed with new time
- Juan receives confirmation

**Alternative Path 2: Decline**
- Step 10: Juan realizes yacht needs maintenance tomorrow
- Juan taps "Decline" button
- Opens decline form
- Reason: "Equipment unavailable"
- Explanation: "Our yacht is undergoing scheduled maintenance tomorrow. We apologize! We're available on Dec 26-27 instead, with 10% additional discount."
- Juan taps "Decline Booking"
- Maria receives notification: "Booking Request Declined"
- Maria sees reason and alternative dates
- Maria can rebook for suggested dates or choose different partner

---

## Flow 3: Member Tier Progression

**Actors:** Alfred (frequent Subic Bay visitor)

**Timeline:**

**Month 1:**
- Alfred signs up: REGISTRATION tier (0 points, 5% discount, ₱25K insurance, paid ₱150)
- Books hotel (earns 500 points)
- Books restaurant (earns 500 points)
- Checks in at 5 different partners (earns 100 points each = 500 total)
- Shares app with friend (earns 200 points)
- **End of Month 1: 1,700 points**

**Month 2:**
- Books yacht cruise (500 points)
- Books diving tour (500 points)
- Books 3 restaurant reservations (1,500 points)
- Checks in at 10 partners (1,000 points)
- Leaves 5 reviews (500 points)
- **End of Month 2: 1,700 + 4,000 = 5,700 points**
- **DING!** Notification: "🎉 Tier Upgrade! You're now BASIC!"
- Membership card updates:
  - Tier badge: BASIC MEMBER (green)
  - Discount: 10% (was 5%)
  - Insurance: ₱100,000 (was ₱25,000)
  - Points: 5,700 / 15,000 to Premium
- Alfred immediately sees savings increase on future bookings

**Months 3-6:**
- Alfred continues booking frequently (loves Subic Bay!)
- Each month: ~2,500 points earned
- **By end of Month 6: 15,300 points**
- **DING!** "🎉 Tier Upgrade! You're now PREMIUM!"
- Membership card updates:
  - Tier badge: PREMIUM MEMBER (orange)
  - Discount: 15%
  - Insurance: ₱500,000
  - Points: 15,300 / 30,000 to Elite
  - **NEW PERK:** AI 24/7 concierge and booking services

**Year 1 End:**
- Alfred has 32,000 points
- **DING!** "🎉 Tier Upgrade! You're now ELITE!"
- Membership card updates:
  - Tier badge: ELITE MEMBER (blue/gold)
  - Discount: 20%
  - Insurance: ₱1,000,000
  - **ELITE PERKS:**
    - Yacht cruise for 20 pax OR 4 room nights per year
    - AI 24/7 concierge and booking services
    - Priority booking (requests auto-accepted if merchant enabled)
    - Exclusive events access
    - Airport lounge access
- Alfred's lifetime savings: Over ₱50,000 in discounts
- Alfred's ROI on ₱25,500 Elite membership: 200%

**Key Insight:**
- Registration → Basic: 5,000 points (typically 2-3 months of moderate use) OR pay ₱550
- Basic → Premium: 15,000 points (typically 6 months total) OR pay ₱5,500
- Premium → Elite: 30,000 points (typically 1 year total) OR pay ₱25,500
- OR: User can pay ₱25,500 upfront for instant Elite access

---

## Flow 4: Merchant Onboarding (Off-App)

**Note:** Merchants don't self-register. They're onboarded by Subic.Life admin team.

**Actors:**
- Rosa (owns "Sunset Bay Restaurant")
- Admin Team (Subic.Life staff)

**Steps:**
1. Rosa hears about Subic.Life from another business owner
2. Rosa visits subic.life website, sees "Become a Partner" link
3. Rosa fills out interest form:
   - Business name, type, location
   - Contact info
   - Why interested in joining
4. Admin receives form submission
5. Admin emails Rosa to schedule call
6. 30-minute call: Admin explains:
   - How platform works (two-sided marketplace)
   - Commission structure (10% on bookings)
   - Marketing exposure to tourists
   - Booking management tools
   - No upfront fees
7. Rosa agrees to join
8. Admin creates merchant account:
   - Email: sunset.bay@subic.life
   - Temporary password: (sent via SMS)
   - Partner profile in database
9. Admin onboarding session (1 hour, in-person or video):
   - Show Rosa merchant portal login
   - Tour of dashboard
   - How to accept/decline bookings
   - How to send counter-offers
   - How to use QR scanner
   - Setting up notifications (WhatsApp integration)
10. Rosa practices with test bookings
11. Admin takes professional photos of restaurant (for partner listing)
12. Admin creates restaurant's profile:
    - Name: Sunset Bay Restaurant
    - Category: Dining
    - Description: "Beachfront dining with fresh seafood..."
    - Packages: Romantic Dinner (₱3,500), Family Feast (₱5,000)
    - Discount: 10% standard, 25% Elite
    - Photos uploaded
13. Admin marks profile as "Active"
14. Sunset Bay Restaurant now appears in user app under "Dining"
15. Rosa receives first booking request (next day!)
16. Rosa accepts, guest arrives, shows QR code
17. Rosa scans with tablet, confirms guest
18. Guest pays bill with discount applied
19. Rosa checks portal: Revenue dashboard updated
20. End of month: Subic.Life transfers funds (gross - commission)

**Ongoing:**
- Rosa uses portal daily to manage bookings
- Rosa refers other restaurants (earns referral bonus)
- Rosa sees steady increase in tourist bookings
- Subic.Life becomes 30% of Rosa's total revenue

---

## Flow 5: Emergency Cancellation

**Actors:** Maria (has confirmed yacht booking)

**Scenario:** Maria gets sick the morning of her yacht cruise

**Steps:**
1. Maria wakes up sick (food poisoning)
2. Maria opens app → My Pass → Upcoming Bookings
3. Finds La Banca Cruises booking (today, 4:30 PM)
4. Taps booking card
5. Booking detail opens showing:
   - Status: CONFIRMED
   - Date: Today, 4:30 PM
   - Cancellation policy: "Free cancellation up to 24 hours before"
   - Current time: 8:00 AM (within 24h window)
6. Maria sees warning: "Cancelling within 24 hours may forfeit deposit"
7. Maria taps "Cancel Booking" button (red)
8. Confirmation dialog: "Are you sure? Deposit (₱2,000) will be forfeited"
9. Maria taps "Yes, Cancel"
10. Cancellation reason dropdown:
    - "I'm sick/emergency"
    - "Weather concerns"
    - "Change of plans"
    - "Found alternative"
11. Maria selects "I'm sick/emergency"
12. Optional message: "I have food poisoning, really sorry for late notice"
13. Maria taps "Submit Cancellation"
14. Supabase updates booking: status='cancelled', cancellation_reason
15. Notification sent to La Banca Cruises
16. Juan (merchant) sees notification: "Cancellation - Maria Cruz"
17. Juan opens booking, sees reason, sympathizes
18. Juan has 2 options:
    - "Acknowledge" (keeps deposit)
    - "Refund Deposit" (goodwill gesture)
19. Juan taps "Refund Deposit" (being nice since it's medical)
20. Refund processed back to Maria's GCash
21. Maria receives notification: "Deposit refunded - La Banca Cruises"
22. Maria appreciates gesture, leaves 5-star review: "Compassionate business"
23. Maria fully recovers, rebooks for next week
24. Juan gives Maria 10% additional discount for the trouble

**Alternative Path: Merchant Cancels**
- Scenario: Yacht breaks down day before
- Juan opens confirmed booking in portal
- Juan taps "Cancel Booking" (merchant-initiated)
- Reason: "Equipment failure"
- Explanation: "Engine issue, cannot operate safely. Full refund issued."
- Juan taps "Cancel & Refund"
- Maria receives notification: "Booking Cancelled by Partner"
- Maria sees full refund (including deposit)
- Maria gets suggested alternatives: "Other yachts available on your dates"
- Subic.Life offers Maria ₱500 credit as apology
- Maria books alternative yacht, uses credit

---

## Flow 6: Insurance Claim

**Actors:** Maria (had accident during yacht cruise)

**Scenario:** Maria slips on yacht deck, sprains ankle

**Steps:**
1. Maria slips, injures ankle during cruise
2. Captain calls paramedics
3. Maria taken to Subic Bay Medical Center
4. Doctor examines: sprained ankle, needs X-ray and treatment
5. Maria shows her Subic.Life membership card to hospital staff
6. Hospital verifies: Elite member, ₱1M insurance coverage
7. Treatment provided: X-ray (₱2,500), consultation (₱1,500), ankle brace (₱800)
8. Total bill: ₱4,800
9. Hospital bills Subic.Life insurance partner (Standard Insurance)
10. Maria pays nothing out of pocket
11. Maria receives email: "Insurance Claim Processed"
12. Maria opens app → My Pass → Benefits → Insurance Coverage
13. Shows claim record:
    - Date of incident
    - Treatment details
    - Amount covered: ₱4,800
    - Remaining coverage: ₱995,200
14. Maria recovers in 2 weeks
15. Subic.Life follows up: "How are you feeling? Here's a voucher for a recovery massage"
16. Maria leaves review: "Insurance was a lifesaver, covered everything!"

**Note:** Insurance is real and provided through partnership with Standard Insurance. Claims are processed through Standard Insurance's system, not the app.

---


# Technical Architecture

## Tech Stack

### Frontend

**Framework:** Next.js 14 (App Router)
- **Why:** React-based, excellent performance, SEO-friendly, API routes built-in
- **Version:** 14.x (latest stable)
- **Router:** App Router (not Pages Router)

**Language:** TypeScript 5
- **Why:** Type safety, catches errors early, better IDE support
- **Config:** Strict mode enabled

**Styling:** Tailwind CSS 4
- **Why:** Utility-first, fast development, small bundle size
- **Config:** Custom design tokens matching our system

**UI Components:** shadcn/ui
- **Why:** Beautifully designed, accessible, customizable, copy-paste (not installed)
- **Components Used:** Button, Card, Dialog, Sheet, Input, Select, Checkbox, etc.

**Icons:** Lucide React
- **Why:** Clean outlined style, tree-shakeable, actively maintained
- **Usage:** Import only needed icons

**Forms:** React Hook Form + Zod
- **Why:** Performance (uncontrolled inputs), type-safe validation
- **Validation:** Zod schemas for all forms

**Charts:** Recharts
- **Why:** React-native, responsive, good documentation
- **Usage:** Bar charts, pie charts, line charts for merchant analytics

**QR Codes:** qrcode.react
- **Why:** Generate QR codes for member cards
- **Security:** QR refreshes every 30 seconds

**QR Scanner:** html5-qrcode
- **Why:** Camera-based scanning for merchants
- **Compatibility:** Works on iOS and Android browsers

### Backend

**Database:** Supabase (PostgreSQL)
- **Why:** Realtime subscriptions, auth built-in, generous free tier, PostgreSQL (reliable)
- **Version:** Latest (cloud-hosted)

**Authentication:** Supabase Auth
- **Methods:** Email/password (primary), Google OAuth (optional)
- **Session:** JWT tokens, stored in httpOnly cookies

**Storage:** Supabase Storage
- **Usage:** User avatars, partner logos, uploaded images
- **Access:** Public buckets for images, private for documents

**Realtime:** Supabase Realtime
- **Usage:** New booking notifications, status updates
- **Protocol:** WebSocket subscriptions

**AI Concierge:** OpenAI GPT-4
- **Why:** Industry-leading natural language understanding, context-aware responses
- **Integration:** Real API with custom knowledge base (not mocked)
- **Model:** gpt-4 or gpt-4-turbo-preview
- **Context:** Fed with user profile, complete partner database, local knowledge
- **Usage:** Personalized recommendations, conversational booking assistance

**Payments (Demo Only):** Mocked
- **Note:** No real payment processing in demo
- **Future:** Integrate Stripe or PayMongo (Philippines)

### Deployment

**Hosting:** Vercel
- **Why:** Built for Next.js, automatic deployments, edge network
- **Region:** Global CDN (fast everywhere)

**Domain:** subic.life (example)
- **User App:** app.subic.life OR subic.life/app
- **Merchant Portal:** subic.life/portal OR partners.subic.life

**CI/CD:** 
- Git push to main → Vercel auto-deploys
- Preview deployments for pull requests

**Monitoring:**
- Vercel Analytics (performance)
- Sentry (error tracking) - optional
- Google Analytics (user behavior) - optional

---

## Data Architecture

> **⚠️ NOTE: FUTURE IMPLEMENTATION**  
> This section documents the complete Supabase database schema and architecture for future backend integration.  
> **Current Phase:** UI/Visual development only - use hardcoded data arrays instead of database queries.  
> **When Ready:** Create Supabase project, run these migrations, replace mock data with actual queries.

### Database Schema (PostgreSQL via Supabase)

**Tables:**

```sql
-- Users (members)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  birthday DATE,
  address TEXT,
  avatar_url TEXT,
  
  -- Membership
  tier TEXT DEFAULT 'registration' CHECK (tier IN ('registration', 'basic', 'premium', 'elite')),
  member_id TEXT UNIQUE NOT NULL, -- Format: MEM001234
  points INTEGER DEFAULT 0,
  insurance_amount INTEGER NOT NULL, -- Based on tier
  valid_until DATE NOT NULL, -- Membership expiry
  
  -- Onboarding
  onboarding_completed BOOLEAN DEFAULT FALSE,
  onboarding_preferences JSONB, -- Quiz answers
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Partners (merchants)
CREATE TABLE partners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('hotels', 'restaurants', 'activities', 'water-sports', 'services')),
  
  -- Profile
  logo_url TEXT,
  description TEXT,
  phone TEXT,
  whatsapp_number TEXT,
  address TEXT,
  website TEXT,
  
  -- Discounts
  discount_percentage INTEGER DEFAULT 10, -- For Basic/Premium
  elite_discount_percentage INTEGER DEFAULT 20, -- For Elite
  
  -- Settings
  auto_accept_bookings BOOLEAN DEFAULT FALSE,
  auto_accept_criteria JSONB, -- Conditions for auto-accept
  booking_window_days INTEGER DEFAULT 90,
  cancellation_policy TEXT DEFAULT 'flexible',
  response_time_hours INTEGER DEFAULT 24,
  notification_preferences JSONB,
  
  -- Business hours
  business_hours JSONB, -- { "mon": { "open": "09:00", "close": "22:00" }, ... }
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Relations
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  partner_id UUID REFERENCES partners(id) ON DELETE CASCADE NOT NULL,
  
  -- Type & Details
  booking_type TEXT NOT NULL CHECK (booking_type IN ('hotel', 'restaurant', 'yacht', 'activity')),
  booking_details JSONB NOT NULL, -- Flexible structure per type
  -- Example for hotel: { "check_in": "2024-12-25", "check_out": "2024-12-26", "room_type": "Deluxe", "guests": { "adults": 2, "children": 0 }, "special_requests": "Ocean view" }
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'declined', 'completed', 'cancelled', 'counter_offer_sent')),
  confirmed_at TIMESTAMPTZ,
  checked_in_at TIMESTAMPTZ,
  decline_reason TEXT,
  decline_explanation TEXT,
  cancellation_reason TEXT,
  cancellation_note TEXT,
  
  -- Payment
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded', 'pay_on_arrival')),
  payment_method TEXT, -- 'card', 'gcash', 'maya', 'cash'
  total_amount INTEGER NOT NULL, -- In cents (₱1 = 100)
  discount_amount INTEGER DEFAULT 0,
  final_amount INTEGER NOT NULL,
  
  -- Internal (merchant)
  internal_note TEXT, -- Private note from merchant
  assigned_to TEXT, -- Room number, table, yacht, etc.
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Recipient (user OR partner)
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  partner_id UUID REFERENCES partners(id) ON DELETE CASCADE,
  
  -- Content
  type TEXT NOT NULL, -- 'booking_confirmed', 'booking_declined', 'counter_offer', 'points_earned', etc.
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  
  -- State
  read BOOLEAN DEFAULT FALSE,
  
  -- Optional link
  link_url TEXT, -- Where to navigate when tapped
  
  -- Timestamp
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Counter Offers
CREATE TABLE counter_offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Relations
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE NOT NULL,
  partner_id UUID REFERENCES partners(id) ON DELETE CASCADE NOT NULL,
  
  -- Offer
  offer_details JSONB NOT NULL, -- Alternative dates/packages/prices
  merchant_note TEXT, -- Explanation from merchant
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Favorites (User's saved partners)
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  partner_id UUID REFERENCES partners(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, partner_id) -- One favorite per user-partner pair
);

-- Reviews (Future feature)
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  partner_id UUID REFERENCES partners(id) ON DELETE CASCADE NOT NULL,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  images JSONB, -- Array of image URLs
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Concierge Messages (Chat history)
CREATE TABLE concierge_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  metadata JSONB, -- Venue cards, booking details, etc.
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payment Methods (Saved cards - demo only)
CREATE TABLE payment_methods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('card', 'gcash', 'maya')),
  last_four TEXT, -- Last 4 digits
  expiry TEXT, -- MM/YY
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Indexes (for performance):**
```sql
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_partner_id ON bookings(partner_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_created_at ON bookings(created_at DESC);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_partner_id ON notifications(partner_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_reviews_partner_id ON reviews(partner_id);
```

**Functions (Stored Procedures):**
```sql
-- Add points to user
CREATE OR REPLACE FUNCTION add_points(user_id UUID, points INTEGER)
RETURNS void AS $$
BEGIN
  UPDATE users
  SET points = points + $2,
      updated_at = NOW()
  WHERE id = $1;
  
  -- Check tier upgrade
  -- If points >= 5000 AND tier = 'registration', upgrade to 'basic'
  -- If points >= 15000 AND tier = 'basic', upgrade to 'premium'
  -- If points >= 30000 AND tier = 'premium', upgrade to 'elite'
  -- (Implementation details)
END;
$$ LANGUAGE plpgsql;

-- Get partner analytics
CREATE OR REPLACE FUNCTION get_partner_analytics(
  partner_id UUID,
  start_date DATE,
  end_date DATE
)
RETURNS TABLE (
  total_revenue BIGINT,
  total_bookings BIGINT,
  avg_booking_value NUMERIC,
  acceptance_rate NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    SUM(final_amount) AS total_revenue,
    COUNT(*) AS total_bookings,
    AVG(final_amount) AS avg_booking_value,
    (COUNT(*) FILTER (WHERE status = 'confirmed') * 100.0 / COUNT(*)) AS acceptance_rate
  FROM bookings
  WHERE bookings.partner_id = $1
    AND created_at >= $2
    AND created_at <= $3;
END;
$$ LANGUAGE plpgsql;
```

**Triggers:**
```sql
-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- (Apply to all tables with updated_at)
```

**Row Level Security (RLS):**
```sql
-- Users can only see their own data
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY users_select_own ON users
  FOR SELECT USING (auth.uid() = id);

-- Partners can only see their own bookings
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY bookings_partner_select ON bookings
  FOR SELECT USING (
    partner_id IN (
      SELECT id FROM partners WHERE email = auth.jwt() ->> 'email'
    )
  );

-- (More policies for insert, update, delete)
```

---

## API Architecture

> **⚠️ NOTE: FUTURE IMPLEMENTATION**  
> This section documents Supabase client usage and API patterns for future backend integration.  
> **Current Phase:** Use mock data and client-side state management instead of Supabase queries.  
> **Exception:** OpenAI Concierge API IS implemented (Next.js API route with hardcoded context).

### Supabase Client (Browser)

**Initialization:**
```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

**Authentication:**
```typescript
// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'secure_password'
})

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'secure_password'
})

// Sign out
await supabase.auth.signOut()

// Get current user
const { data: { user } } = await supabase.auth.getUser()
```

**Queries:**
```typescript
// Select
const { data, error } = await supabase
  .from('partners')
  .select('*')
  .eq('category', 'hotels')

// Insert
const { data, error } = await supabase
  .from('bookings')
  .insert({
    user_id: userId,
    partner_id: partnerId,
    booking_type: 'hotel',
    booking_details: { ... },
    total_amount: 10000,
    final_amount: 9000
  })
  .select()
  .single()

// Update
const { data, error } = await supabase
  .from('bookings')
  .update({ status: 'confirmed' })
  .eq('id', bookingId)

// Delete
const { data, error } = await supabase
  .from('favorites')
  .delete()
  .eq('id', favoriteId)
```

**Realtime Subscriptions:**
```typescript
// User app - listen for booking updates
const subscription = supabase
  .channel('booking-updates')
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'bookings',
    filter: `user_id=eq.${userId}`
  }, (payload) => {
    console.log('Booking updated:', payload.new)
    // Update UI
  })
  .subscribe()

// Merchant portal - listen for new bookings
const merchantSub = supabase
  .channel('merchant-bookings')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'bookings',
    filter: `partner_id=eq.${partnerId}`
  }, (payload) => {
    console.log('New booking:', payload.new)
    // Show notification
  })
  .subscribe()

// Cleanup
subscription.unsubscribe()
```

### Next.js API Routes (Server)

**Demo Payment Processing:**
```typescript
// app/api/payment/route.ts
export async function POST(request: Request) {
  const { amount, method } = await request.json()
  
  // Simulate payment processing
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // Always succeed in demo
  return Response.json({
    success: true,
    transaction_id: `TXN-${Date.now()}`
  })
}
```

**Concierge AI (OpenAI GPT-4 Integration - REAL API):**

**Note:** This is a REAL OpenAI integration using an actual API key, not mocked or pattern-matched responses.

```typescript
// app/api/concierge/route.ts
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // Real API key from environment
})

export async function POST(request: Request) {
  const { message, userId, conversationHistory } = await request.json()
  
  // Fetch user data and partners for context
  const user = await getUserData(userId)
  const partners = await getAvailablePartners()
  
  // Build system prompt with context
  const systemPrompt = `You are a helpful concierge for Subic.Life, a premium travel membership platform in Subic Bay, Philippines.

User Info:
- Name: ${user.name}
- Tier: ${user.tier} (${getDiscountByTier(user.tier)}% discount)
- Preferences: ${JSON.stringify(user.onboarding_preferences)}
- Booking History: ${user.booking_count} bookings, favorite category: ${user.favorite_category}

Available Partners (Complete Database):
${partners.map(p => `
- ${p.name} (${p.category})
  Description: ${p.description}
  Location: ${p.address}
  Rating: ${p.rating}/5 (${p.review_count} reviews)
  Discount: ${p.discount_percentage}% (${p.elite_discount_percentage}% for Elite)
  Packages: ${JSON.stringify(p.packages)}
`).join('\n')}

Current Subic Bay Context:
- Weather: ${currentWeather}
- Ongoing Events: ${upcomingEvents}
- Peak Season: ${isPeakSeason}

Instructions:
- Be helpful, enthusiastic but professional
- Use the user's first name naturally (${user.name})
- Acknowledge their ${user.tier} tier and ${getDiscountByTier(user.tier)}% discount
- Reference their preferences: ${JSON.stringify(user.onboarding_preferences)}
- When recommending venues, use format: [VENUE_CARD:partner_id]
- When user wants to book, use: [BOOKING_FORM:partner_id]
- For multiple options, use: [MULTIPLE_OPTIONS:id1,id2,id3]
- Keep responses concise (under 100 words unless details requested)
- Focus only on Subic Bay establishments
- Provide specific recommendations based on user preferences and booking history
- Mention specific package names and prices when relevant
- Use local knowledge (beaches, landmarks, best times to visit)`

  // Call OpenAI
  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: message }
    ],
    temperature: 0.7,
    max_tokens: 500,
    stream: false
  })
  
  const aiResponse = completion.choices[0].message.content
  
  // Parse response for special tags and render components
  const { text, cards, bookingForm } = parseAIResponse(aiResponse, partners)
  
  // Save conversation to database
  await saveConversation(userId, message, aiResponse)
  
  return Response.json({ text, cards, bookingForm })
}

// Helper to parse AI response for special tags
function parseAIResponse(response: string, partners: Partner[]) {
  let text = response
  const cards = []
  let bookingForm = null
  
  // Extract venue cards: [VENUE_CARD:partner_id]
  const venueMatches = response.matchAll(/\[VENUE_CARD:([^\]]+)\]/g)
  for (const match of venueMatches) {
    const partnerId = match[1]
    const partner = partners.find(p => p.id === partnerId)
    if (partner) {
      cards.push(partner)
      text = text.replace(match[0], '') // Remove tag from text
    }
  }
  
  // Extract booking forms: [BOOKING_FORM:partner_id]
  const bookingMatch = response.match(/\[BOOKING_FORM:([^\]]+)\]/)
  if (bookingMatch) {
    bookingForm = bookingMatch[1]
    text = text.replace(bookingMatch[0], '')
  }
  
  return { text: text.trim(), cards, bookingForm }
}
```

**AI Knowledge Base (Fed Information):**

The OpenAI concierge receives comprehensive, real-time data on every request:

1. **User Profile Data (from Supabase):**
   - Full name, membership tier, discount percentage
   - Onboarding quiz preferences (travel vibe, companions, purpose)
   - Complete booking history (past bookings, favorite categories)
   - Points balance and tier progression status
   - Favorite partners (from favorites table)

2. **Complete Partner Database (from Supabase):**
   - All 50+ partner details:
     - Name, category, description, location
     - Full address with landmarks
     - Star rating and review count
     - Available packages with detailed descriptions and pricing
     - Discount percentages (standard + elite)
     - Business hours and availability
     - Special features (ocean view, kid-friendly, etc.)
   - Dynamically fetched on each request (always current)

3. **Contextual Information (dynamic):**
   - Current weather in Subic Bay (can integrate weather API)
   - Upcoming events and festivals
   - Peak/off-peak season status
   - Special promotions or limited-time offers
   - Partner availability status

4. **Subic Bay Local Knowledge (in system prompt):**
   - Popular beaches (Baloy Long Beach, Dungaree Beach)
   - Landmarks (Ocean Adventure, Zoobic Safari)
   - Best times to visit specific attractions
   - Local dining etiquette and customs
   - Transportation tips
   - Safety information
   - Family-friendly vs. adult-oriented venues

5. **Conversation Memory:**
   - Full conversation history stored in `concierge_messages` table
   - AI has context of entire conversation (not just current message)
   - Can reference previous recommendations
   - Remembers user's stated preferences within conversation

**Example Context Size Per Request:**
```typescript
{
  // User data: ~500 tokens
  user: {
    name: "Maria",
    tier: "premium",
    discount: 15,
    preferences: { vibe: "relaxation", companions: "family" },
    booking_history: [...]
  },
  
  // Partners: ~5,000 tokens (50 partners × 100 tokens each)
  partners: [
    {
      id: "...",
      name: "Lighthouse Marina Resort",
      category: "hotels",
      description: "Luxury beachfront resort...",
      packages: [...],
      rating: 4.8,
      reviews: 298
    },
    // ... 49 more partners
  ],
  
  // Context: ~500 tokens
  context: {
    weather: "sunny, 28°C",
    events: ["Beach Festival this weekend"],
    peakSeason: false
  },
  
  // Conversation history: variable (up to ~2,000 tokens)
  history: [...]
}

// Total context: ~8,000 tokens per request
// GPT-4 context window: 128,000 tokens (plenty of room)
```

**Benefits of Real OpenAI Integration:**
- Natural language understanding (understands nuanced requests)
- Context awareness (remembers conversation, user preferences)
- Intelligent recommendations (analyzes user profile + preferences)
- Flexible responses (not limited to predefined patterns)
- Handles edge cases (unusual requests, clarifying questions)
- Continuous improvement (OpenAI models improve over time)

**Environment Variables Required:**
```bash
OPENAI_API_KEY=sk-... # Real OpenAI API key
OPENAI_MODEL=gpt-4 # or gpt-4-turbo-preview for faster responses
```

---

## State Management

> **✅ CURRENT IMPLEMENTATION**  
> This is the primary approach for the UI-only development phase.  
> Use React Context + useState for all data management. No Supabase integration yet.

### React Context (Global State)

**User Context:**
```typescript
// lib/user-context.tsx
interface UserContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  updatePoints: (points: number) => void
  checkTierUpgrade: () => void
}

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Load user on mount
  useEffect(() => {
    loadUser()
  }, [])
  
  // ... implementation
  
  return (
    <UserContext.Provider value={{ user, loading, signIn, signOut, updatePoints, checkTierUpgrade }}>
      {children}
    </UserContext.Provider>
  )
}

// Usage in components
const { user, signOut } = useUserContext()
```

**Merchant Context (Partner Switcher):**
```typescript
// lib/merchant-context.tsx
interface MerchantContextType {
  currentPartner: Partner | null
  allPartners: Partner[]
  switchPartner: (partner: Partner) => void
}

// Similar implementation
```

### Local State (Component-Level)

**React Hook Form (Forms):**
```typescript
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const bookingSchema = z.object({
  checkIn: z.date(),
  checkOut: z.date(),
  guests: z.number().min(1).max(20),
  specialRequests: z.string().max(500).optional()
})

type BookingFormData = z.infer<typeof bookingSchema>

const BookingForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema)
  })
  
  const onSubmit = async (data: BookingFormData) => {
    // Submit booking
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  )
}
```

**useState (Simple State):**
```typescript
const [isModalOpen, setIsModalOpen] = useState(false)
const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null)
const [searchQuery, setSearchQuery] = useState('')
```

---

## Security Considerations

### Authentication
- JWTs stored in httpOnly cookies (not localStorage - prevents XSS)
- Session expiry: 7 days (refresh tokens for longer sessions)
- Email verification required for signup

### Authorization
- Row Level Security (RLS) enforced in Supabase
- Users can only access their own data
- Merchants can only access their own bookings
- API routes validate user permissions

### Data Validation
- All inputs validated client-side (React Hook Form + Zod)
- All inputs validated server-side (Supabase RLS + functions)
- SQL injection prevented (Supabase uses parameterized queries)
- XSS prevented (React escapes output by default)

### Payments
- Demo only - no real credit cards processed
- In production, use PCI-compliant gateway (Stripe, PayMongo)
- Never store full card numbers (only last 4 digits)
- Tokenize cards through gateway

### QR Codes
- Time-limited (30-second refresh)
- Include timestamp in QR data
- Merchant validates timestamp when scanning
- Invalid QR codes rejected

---

# Boundaries & Constraints

## What Subic.Life DOES

✅ **Core Functions:**
- Membership tiers with benefits (discounts, insurance, points)
- Partner discovery and search
- Booking request system (not instant booking)
- Digital membership card with QR code
- OpenAI GPT-4 powered concierge for personalized recommendations and booking assistance
- Booking management (view, cancel, review)
- Merchant booking management (accept, decline, counter-offer)
- QR code verification for check-ins
- Points system and tier progression
- Realtime notifications
- Payment simulation (demo only)
- Analytics dashboard for merchants

## What Subic.Life DOES NOT Do

❌ **Out of Scope:**
1. **Instant Booking Confirmation**
   - All bookings are requests (pending merchant approval)
   - No live availability calendars
   - Merchant must manually confirm

2. **Real Payment Processing**
   - Demo mode only - no real charges
   - No refunds, no payment disputes
   - Production would integrate Stripe/PayMongo

3. **Multi-City Platform**
   - Only Subic Bay, Philippines
   - Not nationwide, not international
   - Deeply local focus

4. **Merchant Self-Registration**
   - Merchants are onboarded by admin team
   - No self-serve signup
   - Quality control required

5. **Social Features**
   - No user profiles visible to others
   - No following/followers
   - No social feed
   - No user-to-user messaging

6. **Advanced Booking Features**
   - No group bookings (booking for others)
   - No split payments (one payer only)
   - No recurring bookings (weekly, monthly)
   - No auction/bidding for last-minute deals

7. **Loyalty Program Integrations**
   - No airline miles integration
   - No credit card points transfer
   - Self-contained points system only

8. **Travel Planning**
   - No itinerary builder
   - No trip sharing
   - No packing lists
   - No weather forecasts
   - Focus is discovery + booking, not planning

9. **Review System (MVP)**
    - Simple 5-star + text (no photos in MVP)
    - No review moderation
    - No review responses from merchants
    - No verified purchase badges

10. **Merchant Analytics (Limited)**
    - Basic metrics only (revenue, bookings, acceptance rate)
    - No predictive analytics
    - No A/B testing
    - No customer segmentation

11. **Push Notifications (Limited)**
    - In-app notifications only in demo
    - No SMS notifications
    - No email marketing campaigns
    - Production would add Firebase/OneSignal

12. **Offline Mode**
    - App requires internet connection
    - No offline caching (except membership card)
    - No offline booking queue

13. **Accessibility Features (Limited)**
    - WCAG AA compliant (not AAA)
    - No text-to-speech built-in (uses OS features)
    - No high-contrast mode toggle
    - No font size adjustments

14. **Multi-Language Support**
    - English only
    - No Tagalog, no other languages
    - Production would add i18n

---

## Interaction Boundaries

❌ **Interaction Don'ts:**
1. No multi-page forms (use bottom sheets)
2. No confirmation emails required to proceed (async)
3. No forced app updates (seamless)
4. No pop-up ads or cross-sells
5. No infinite scrolls (pagination after 50 items)
6. No auto-refresh without user action
7. No shake-to-undo gestures (confusing)
8. No force touch/3D touch (not universal)

❌ **Content Don'ts:**
1. No user-generated content (except reviews)
2. No forums or community features
3. No blog or news section
4. No promotional emails (transactional only)
5. No affiliate links to external booking sites
6. No ads from third parties

---

## Technical Boundaries

❌ **Not Supported:**
1. **Browsers:** IE11, Opera Mini (modern browsers only)
2. **Devices:** Devices older than 2018 (iOS 14+, Android 9+)
3. **Platforms:** Desktop-only apps (web-based only)
4. **Screen Sizes:** < 320px width (too small)
5. **Backend:** No server-side rendering for SEO (app pages are behind auth)
6. **Databases:** No NoSQL or MongoDB (PostgreSQL only)
7. **Caching:** No Redis (Supabase handles caching)
8. **CDN:** No custom CDN (Vercel CDN only)

---

## Business Model Boundaries

❌ **Revenue NOT From:**
1. Ads (no advertising)
2. Selling user data (privacy-focused)
3. Freemium features (single membership model)
4. White-label reselling (Subic.Life only)
5. API access for third parties (closed system)

✅ **Revenue Only From:**
1. Membership fees (₱150 - ₱25,500/year)
2. Commission on bookings (10%)

---

## Geographic Boundaries

✅ **Only Operates In:**
- Subic Bay, Zambales, Philippines
- Specifically: Subic Bay Freeport Zone + surrounding areas

❌ **Does NOT Operate In:**
- Manila (different city)
- Boracay (different island)
- Palawan (different region)
- Any other Philippine city
- International destinations

**Rationale:** Deep local focus = better curation, stronger partnerships, more trust

---

## User Support Boundaries

✅ **Support Provided:**
- In-app help center (FAQs)
- Email support (support@subic.life)
- WhatsApp support for merchants
- Response time: 24 hours

❌ **Support NOT Provided:**
1. Phone support (email/WhatsApp only)
2. 24/7 support (business hours only)
3. On-site support (remote only)
4. Technical support for partner systems (own IT)
5. Travel advice (not travel agents)
6. Visa/immigration help (not qualified)

---

## Environmental/Social Boundaries

✅ **Social Responsibility:**
- 5% of profits to beach cleanup (Lighthouse Legacy Foundation)
- Support local businesses (not chains)
- Promote sustainable tourism

❌ **NOT Our Role:**
1. We don't operate the cleanup (foundation does)
2. We don't enforce environmental standards on partners (encourage only)
3. We don't certify "eco-friendly" businesses (not qualified)
4. We don't lobby government (advocacy not our strength)

---

## Future Features (Not in MVP)

🔮 **Planned for Future (Post-MVP):**
1. Review system with photos
2. Membership referral program
3. Gift memberships
4. Corporate/group memberships
5. Seasonal passes (rainy season discount)
6. Integration with hotel PMS systems
7. Integration with restaurant POS systems
8. WhatsApp booking (text to book)
9. SMS notifications
10. Push notifications
11. Apple Wallet / Google Wallet passes
12. Offline mode for membership card
13. Trip planning tools
14. Multi-language (English + Tagalog)
15. Expanded coverage (nearby cities)

---

## Demo-Specific Constraints

**Important for LLM Implementation:**

**🎨 CURRENT PHASE: UI/VISUAL DEVELOPMENT ONLY**

This phase focuses exclusively on building pixel-perfect frontend components. NO backend integration yet.

✅ **What to Build Now (Visual/Frontend Only):**
- All UI components and screens (exact design system adherence)
- Navigation between screens (React Router/Next.js routing)
- Form validation (client-side only, Zod schemas)
- Loading states, animations, transitions
- Responsive layouts (mobile-first)
- Interactive elements (hover, click, focus states)
- Mock data displayed in components (hardcoded arrays)
- State management (useState, useContext, React Hook Form)
- Toasts/notifications (UI feedback)
- Modal/bottom sheet interactions
- Image galleries, carousels, scrollable lists
- All booking flows (UI only, no API calls)
- **Concierge AI with REAL OpenAI GPT-4**:
  - This IS implemented with actual API calls
  - Requires valid OPENAI_API_KEY in environment variables
  - Fed with hardcoded partner data (not from database)
  - User profile data from React state/localStorage
  - Returns real AI responses, renders venue cards dynamically

✅ **How to Handle Data (No Supabase Yet):**
```typescript
// Use hardcoded data arrays
const MOCK_PARTNERS = [
  { id: '1', name: 'Lighthouse Marina Resort', category: 'hotels', discount: 20, ... },
  { id: '2', name: 'La Banca Cruises', category: 'water-sports', discount: 20, ... },
  // ... 11 partners total
]

const MOCK_USER = {
  id: '1',
  name: 'Alfred',
  email: 'alfred@demo.com',
  tier: 'elite',
  points: 32000,
  insurance_amount: 1000000,
  member_id: 'MEM001234'
}

// Store temporary data in localStorage or state
const [bookings, setBookings] = useState<Booking[]>([])

// Mock async operations with delays
const handleBooking = async (data: BookingData) => {
  setIsLoading(true)
  await new Promise(resolve => setTimeout(resolve, 2000)) // Fake API delay
  
  const newBooking = {
    ...data,
    id: Date.now().toString(),
    status: 'pending',
    created_at: new Date().toISOString()
  }
  
  setBookings([...bookings, newBooking])
  setIsLoading(false)
  toast.success('Booking request sent!')
}
```

✅ **What Works in This Phase:**
- All navigation and routing
- Form submissions (update local state)
- Search and filtering (client-side)
- Login/logout (store demo session in localStorage)
- Booking flows (create booking objects in state)
- Partner discovery (filter hardcoded array)
- Tier upgrades (update user object in state)
- QR code display (static, doesn't refresh)
- Concierge chat (real OpenAI responses with hardcoded context)

❌ **Not Implemented Yet (Future - Supabase Integration):**
- Database queries (Supabase)
- User authentication (Supabase Auth)
- Realtime subscriptions (Supabase Realtime)
- Data persistence across sessions (except localStorage demos)
- Server-side API routes (Next.js API routes)
- Actual payment processing
- Email notifications
- SMS notifications
- WhatsApp integration
- Analytics tracking
- Error monitoring

📋 **Supabase Schema (Designed, Not Connected):**
The complete database schema is documented in the Technical Architecture section for reference. When ready to integrate:
1. Create Supabase project
2. Run schema migrations
3. Replace hardcoded data with `supabase.from()` queries
4. Replace localStorage auth with Supabase Auth
5. Add realtime subscriptions for notifications
6. Deploy API routes for server-side operations

**Why This Approach:**
1. **Iterate Faster:** Make design changes without database complexity
2. **Demo Ready:** Interactive prototype for stakeholders immediately
3. **Perfect UI First:** Nail the user experience before backend integration
4. **Clear Separation:** Frontend devs can work without backend dependencies

**Reason for Overall Demo Scope:** MVP is to prove concept, validate user experience, demo to investors/partners. Full production features come after funding.

---

# Implementation Checklist

## For LLMs Building This App

When implementing Subic.Life, ensure:

### User App Screens
- [ ] Onboarding Quiz (3 questions, skippable)
- [ ] Package Upgrade Offer (Basic/Premium/Elite after quiz)
- [ ] Home Dashboard (card, quick actions, offers, deals)
- [ ] Partners Discovery (search, filter, cards)
- [ ] Partner Detail (gallery, info, packages, CTA)
- [ ] Hotel Booking Flow (7 steps)
- [ ] Restaurant Booking Flow (5 steps)
- [ ] Yacht Booking Flow (7 steps)
- [ ] Activity Booking Flow (7 steps)
- [ ] My Pass (digital card, QR, bookings)
- [ ] Concierge (AI chat with cards)
- [ ] Profile/Settings (account, preferences)

### Merchant Portal Screens
- [ ] Login (demo: demo@subic.life / demo123)
- [ ] Dashboard (metrics, requests, switcher)
- [ ] Booking Detail (view, actions)
- [ ] Counter-Offer Forms (all 5 types)
- [ ] QR Scanner (camera, verification)
- [ ] Settings & Analytics (3 tabs)

### Functionality
- [ ] Authentication works (email/password)
- [ ] Supabase queries work (select, insert, update)
- [ ] Realtime subscriptions work (new bookings appear)
- [ ] **OpenAI GPT-4 integration works (OPENAI_API_KEY set, concierge responds naturally)**
- [ ] **AI receives complete context (user profile, partners, preferences)**
- [ ] **AI response parsing works (venue cards, booking forms appear correctly)**
- [ ] Booking flows create records in database
- [ ] Points system awards points correctly
- [ ] Tier upgrades trigger automatically
- [ ] QR code generates and refreshes
- [ ] Merchant can accept/decline/counter-offer
- [ ] Notifications appear in real-time
- [ ] Search filters partners correctly

### Responsive Design
- [ ] Mobile-first (optimized for 375-414px)
- [ ] Touch targets are 48×48px minimum
- [ ] Bottom nav is thumb-friendly
- [ ] Modals/sheets slide smoothly
- [ ] Images lazy load
- [ ] Safe areas respected (iPhone notch)

### Accessibility
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] All images have alt text
- [ ] Buttons have aria-labels (icon buttons)
- [ ] Keyboard navigation works (tab order logical)
- [ ] Focus indicators visible (:focus-visible)
- [ ] Motion respects prefers-reduced-motion

### Performance
- [ ] First load < 2 seconds
- [ ] Images optimized (WebP, lazy load)
- [ ] Code split by screen
- [ ] No unnecessary re-renders
- [ ] Supabase queries cached where appropriate

### Edge Cases Handled
- [ ] Empty states (no bookings, no partners)
- [ ] Error states (network failure, invalid data)
- [ ] Loading states (skeleton loaders)
- [ ] Validation errors (form feedback)
- [ ] Offline handling (graceful degradation)

---

# Glossary

**Booking Request:** User's submission to reserve a service (pending merchant approval)

**Bottom Sheet:** Modal that slides up from bottom of screen (mobile pattern)

**Concierge:** AI-powered chat assistant for recommendations and booking

**Counter-Offer:** Merchant's suggestion of alternative dates/packages

**Elite Tier:** Highest membership tier (20% discount, ₱1M insurance, yacht cruise/room nights)

**Member:** User with paid Subic.Life membership

**Merchant:** Partner business (hotel, restaurant, etc.)

**Partner:** Same as merchant (business on platform)

**QR Code:** Scannable code on member's digital card for verification

**Realtime:** Instant updates via WebSocket (Supabase feature)

**Tier:** Membership level (Registration, Basic, Premium, Elite)

**Two-Sided Marketplace:** Platform connecting members (demand) with merchants (supply)

---

**END OF MASTER REFERENCE DOCUMENT**

*This document is the single source of truth for Subic.Life. Any LLM implementing this app should refer to this document to ensure accuracy and completeness.*

*Version 1.0 - December 2024*
*Total Length: ~35,000 words*

# My Pass Migration Guide

## Overview

The `My Pass` feature has been consolidated from a page-based architecture with scattered logic to a unified `MembershipPass` component. This improves maintainability, performance, and user experience.

## Changes

### 1. Page Structure (`app/pass/page.tsx`)
-   **Old**: Contained state for bookings, activities, and modals. Handled data fetching and real-time subscriptions directly.
-   **New**: A lightweight wrapper that only renders the `<MembershipPass />` component. All logic has been moved to the component level.

### 2. Component Logic (`components/pass/membership-pass.tsx`)
-   **Old**: Primarily displayed the card and basic tabs.
-   **New**: Now the "Brain" of the Pass feature.
    -   Handles sub-tabs for Bookings (Upcoming/Pending/History).
    -   Integrates `ActivityTimeline` directly into the Points tab.
    -   Manages all modals (Booking Details, Cancel, Counter-Offer).
    -   Uses `useMockDBStore` for centralized state management.

### 3. Visual Enhancements
-   **Card**: Added "Northern Lights" glow, 3D flip animation, and glassmorphism.
-   **Bookings**: Improved card visual hierarchy, added sticky sub-tabs.
-   **Points**: Redesigned tier progress bar and transaction history.

## Migration Steps

If you are reusing the `MembershipPass` component in other parts of the app (e.g., Profile or Dashboard):

1.  **Remove Prop Injection**: The component no longer accepts `bookings` or `activities` as props. It fetches its own data.
    ```tsx
    // OLD
    <MembershipPass bookings={myBookings} />
    
    // NEW
    <MembershipPass />
    ```
2.  **Ensure Context**: The component requires `UserContext` and `MockDBStore` to be active in the provider tree (which they are by default in `layout.tsx`).

## Breaking Changes
-   The `PassPage` export in `app/pass/page.tsx` no longer exports utility functions like `fetchData`. These are now internal to the component or managed by the store.

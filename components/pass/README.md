# Membership Pass Component

The `MembershipPass` component is the core of the "My Pass" feature, designed to provide a premium, unified experience for users to manage their membership, bookings, and points.

## Architecture

The component is structured into three primary tabs:

1.  **Card**: Displays the digital membership pass with a 3D flip effect, QR code, and membership benefits.
2.  **Bookings**: Manages booking history with sub-tabs for Upcoming, Pending, and History.
3.  **Points**: Shows tier progress, earning guide, transaction history, and activity timeline.

## Features

-   **3D Flip Card**: Interactive digital pass with "Northern Lights" glow effects for elite tiers.
-   **Sticky Navigation**: Tab navigation stays visible while scrolling.
-   **Smart Grouping**: Bookings are automatically categorized (Upcoming/Pending/History).
-   **Real-time Updates**: Reflects changes in booking status and points immediately.
-   **Premium Visuals**: Uses glassmorphism (`backdrop-blur`), smooth gradients, and deep shadows (`shadow-2xl`).
-   **Responsive Design**: optimized for mobile touch targets (44px+) and adapts to desktop layouts.

## Props

The component is self-contained and connects to the global store via `useUser` and `useMockDBStore`. It does not require parent props for data injection, making it easy to drop into any page.

## Key Sub-Components

-   `BookingCard`: Rich display of booking details with actions (Cancel, Pay, View Details).
-   `PointsHistory`: Visualizes points balance, tier progress, and transaction log.
-   `ActivityTimeline`: Chronological feed of user activities.
-   `BookingDetailModal`: Detailed view of a specific booking.
-   `CancelBookingModal`: User flow for cancelling a booking.

## Customization

-   **Colors**: Uses the Subic.Life brand palette (`#135bec`, `#F59E0B`, etc.).
-   **Tiers**: Styles are dynamically applied based on user tier (Starter, Basic, Premium, Elite).
-   **Animations**: Built with Tailwind CSS utilities (`animate-in`, `slide-in`, `fade-in`).

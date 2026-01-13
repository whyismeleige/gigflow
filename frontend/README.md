# GigFlow Frontend

Modern, responsive frontend built with Next.js 14, TypeScript, and Tailwind CSS.

## Overview

Feature-rich client application with real-time notifications, state management, and beautiful UI components. Built using the latest Next.js App Router and React Server Components.

---

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit with Redux Persist
- **UI Components**: Radix UI + shadcn/ui
- **Real-time**: Socket.io Client
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form (recommended)
- **Notifications**: React Hot Toast

---

## Project Structure

```
frontend/
├── app/                      # Next.js 14 App Router
│   ├── (dashboard)/         # Dashboard layout group
│   │   ├── gigs/           # Gig pages
│   │   │   ├── [id]/       # Dynamic gig detail
│   │   │   ├── create/     # Create gig
│   │   │   ├── my-gigs/    # User's gigs
│   │   │   └── page.tsx    # Browse gigs
│   │   ├── bids/           # Bid pages
│   │   │   ├── [gigId]/    # Bids for gig
│   │   │   └── my-bids/    # User's bids
│   │   ├── profile/        # User profile
│   │   └── layout.tsx      # Dashboard layout
│   ├── auth/               # Authentication
│   │   └── page.tsx        # Login/Register
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx           # Landing page
│
├── components/              # Reusable components
│   ├── ui/                 # Base UI components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── avatar.tsx
│   │   ├── badge.tsx
│   │   ├── dialog.tsx
│   │   ├── alert-dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── label.tsx
│   │   ├── textarea.tsx
│   │   └── separator.tsx
│   ├── gigs/              # Gig components
│   │   └── GigCard.tsx
│   └── bids/              # Bid components
│       └── BidSubmissionModal.tsx
│
├── store/                  # Redux store
│   ├── slices/
│   │   ├── auth.slice.ts      # Authentication
│   │   ├── gigs.slice.ts      # Gigs management
│   │   └── bids.slice.ts      # Bids management
│   └── index.ts              # Store configuration
│
├── lib/                    # Utilities
│   ├── api/               # API clients
│   │   ├── auth.api.ts
│   │   ├── gigs.api.ts
│   │   └── bids.api.ts
│   ├── socket.ts          # Socket.io client
│   └── utils.ts           # Helper functions
│
├── hooks/                  # Custom hooks
│   ├── redux.ts           # Redux hooks
│   └── useSocket.ts       # Socket.io hook
│
├── types/                  # TypeScript types
│   ├── auth.types.ts
│   ├── gig.types.ts
│   ├── bid.types.ts
│   ├── redux.types.ts
│   └── socket.types.ts
│
├── public/                # Static assets
├── .env.local             # Environment variables
├── next.config.js         # Next.js configuration
├── tailwind.config.ts     # Tailwind configuration
├── tsconfig.json          # TypeScript configuration
└── package.json

```

---

## Installation

```bash
# Install dependencies
npm install

# Install additional required packages
npm install @radix-ui/react-avatar @radix-ui/react-dropdown-menu @radix-ui/react-alert-dialog socket.io-client

# Create environment file
cp .env.example .env.local

```

---

## Environment Variables

Create `.env.local` in the frontend directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080

```

For production:

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com

```

---

## Running the Application

### Development Mode

```bash
npm run dev

```

Runs on `http://localhost:3000`

### Production Build

```bash
npm run build
npm start

```

### Linting

```bash
npm run lint

```

---

## Pages

### Public Pages

- `/` - Landing page with features
- `/auth` - Login/Register page

### Protected Pages (Authentication Required)

- `/gigs` - Browse all available gigs
- `/gigs/[id]` - View gig details and submit bid
- `/gigs/create` - Create a new gig
- `/gigs/my-gigs` - Manage your posted gigs
- `/bids/my-bids` - Track your submitted bids
- `/bids/[gigId]` - View all bids for your gig
- `/profile` - User profile and statistics

---

## UI Components

### Base Components (from shadcn/ui)

```typescript
// Import pattern
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
```

#### Available Components

- `Button` - Primary, secondary, outline variants
- `Input` - Text input fields
- `Textarea` - Multi-line text input
- `Card` - Container with header, content, footer
- `Avatar` - User profile images
- `Badge` - Status indicators
- `Dialog` - Modal dialogs
- `AlertDialog` - Confirmation dialogs
- `DropdownMenu` - Dropdown menus
- `Label` - Form labels
- `Separator` - Visual dividers

### Custom Components

#### GigCard

```typescript
import GigCard from "@/components/gigs/GigCard";

<GigCard gig={gigData} />;
```

#### BidSubmissionModal

```typescript
import BidSubmissionModal from "@/components/bids/BidSubmissionModal";

<BidSubmissionModal
  open={isOpen}
  onClose={() => setIsOpen(false)}
  onSubmit={handleSubmit}
  gigBudget={50000}
/>;
```

---

## State Management (Redux)

### Store Structure

```typescript
{
  auth: {
    user: User | null,
    isAuthenticated: boolean,
    loading: boolean,
    error: string | null
  },
  gigs: {
    items: Gig[],
    currentGig: Gig | null,
    myGigs: Gig[],
    filters: { search: string, status: string },
    pagination: {...},
    loading: boolean,
    error: string | null
  },
  bids: {
    items: Bid[],
    myBids: Bid[],
    gigBids: Bid[],
    loading: boolean,
    error: string | null
  }
}

```

### Using Redux Hooks

```typescript
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { fetchGigs } from "@/store/slices/gigs.slice";

// In component
const dispatch = useAppDispatch();
const { items, loading } = useAppSelector((state) => state.gigs);

// Dispatch actions
dispatch(fetchGigs({ search: "developer" }));
```

### Available Actions

#### Auth Slice

- `registerUser(data)` - Register new user
- `loginUser(credentials)` - Login user
- `logoutUser()` - Logout user
- `checkAuth()` - Verify authentication

#### Gigs Slice

- `fetchGigs({ search, page })` - Get all gigs
- `fetchGigsById(id)` - Get single gig
- `createGig(data)` - Create new gig
- `updateGig({ id, data })` - Update gig
- `deleteGig(id)` - Delete gig
- `getMyGigs()` - Get user's gigs
- `setSearch(query)` - Update search filter

#### Bids Slice

- `getBidsByGig(gigId)` - Get all bids for gig
- `getMyBids()` - Get user's bids
- `createBid(data)` - Submit bid
- `updateBid({ id, data })` - Update bid
- `deleteBid(id)` - Delete bid
- `hireFreelancer(bidId)` - Hire freelancer

---

## Real-time Features (Socket.io)

### Automatic Connection

Socket.io automatically connects when user logs in:

```typescript
// In dashboard layout
import { useSocket } from "@/hooks/useSocket";

export default function DashboardLayout() {
  useSocket(); // Automatically connects
  // ...
}
```

### Socket Events

#### Incoming Events

- `bid-hired` - Received when you're hired for a project

```typescript
// Handled automatically in useSocket hook
socket.on("bid-hired", (data) => {
  toast.success(data.message);
  // {
  //   message: "You have been hired for [Project Name]!",
  //   gigId: "...",
  //   gigTitle: "...",
  //   bidId: "..."
  // }
});
```

---

## Key Features

### Authentication

- ✅ JWT-based authentication
- ✅ HttpOnly cookie storage
- ✅ Auto-redirect on login/logout
- ✅ Protected routes
- ✅ Persistent sessions (Redux Persist)

### Gig Management

- ✅ Browse all gigs
- ✅ Search by title/description
- ✅ View detailed gig information
- ✅ Create new gigs
- ✅ Edit your gigs
- ✅ Delete your gigs
- ✅ View bids received

### Bid Management

- ✅ Submit bids with proposals
- ✅ Track bid status
- ✅ Withdraw pending bids
- ✅ Real-time hire notifications
- ✅ View all your bids

### Hiring Process

- ✅ Review all bids
- ✅ Compare freelancer proposals
- ✅ One-click hiring
- ✅ Automatic bid rejection
- ✅ Transaction safety

### UI/UX

- ✅ Responsive design (mobile-first)
- ✅ Loading states
- ✅ Error handling
- ✅ Toast notifications
- ✅ Confirmation dialogs
- ✅ Empty states
- ✅ Form validations
- ✅ Dark mode support (Tailwind)

---

## Styling

### Tailwind CSS Configuration

```typescript
// tailwind.config.ts
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        // ... more colors
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
```

### CSS Variables

Defined in `app/globals.css`:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  /* ... */
}
```

---

## Development

### Adding New Pages

1.  Create file in `app/` directory:

```typescript
// app/new-page/page.tsx
export default function NewPage() {
  return <div>New Page</div>;
}
```

2.  Access at `/new-page`

### Adding New Components

```typescript
// components/custom/MyComponent.tsx
export default function MyComponent({ prop }: { prop: string }) {
  return <div>{prop}</div>;
}
```

### Adding New Redux Slice

```typescript
// store/slices/newFeature.slice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchData = createAsyncThunk("feature/fetchData", async () => {
  // API call
});

const slice = createSlice({
  name: "feature",
  initialState: { items: [] },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.items = action.payload;
    });
  },
});

export default slice.reducer;
```

---

## Testing

### Manual Testing Checklist

**Authentication**

- [ ] Register new user
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Logout
- [ ] Protected route redirect

**Gigs**

- [ ] Browse all gigs
- [ ] Search gigs
- [ ] View gig details
- [ ] Create new gig
- [ ] Edit own gig
- [ ] Delete own gig
- [ ] Cannot edit/delete others' gigs

**Bids**

- [ ] Submit bid on open gig
- [ ] Cannot bid on own gig
- [ ] View my bids
- [ ] Withdraw pending bid
- [ ] View bids on my gig
- [ ] Hire freelancer
- [ ] Receive real-time notification

---

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production
vercel --prod

```

### Environment Variables (Production)

Add in Vercel dashboard:

```
NEXT_PUBLIC_API_URL=https://your-backend-api.com

```

### Build Optimization

```json
// next.config.js
module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['api.dicebear.com'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
}

```

---

## Dependencies

### Core Dependencies

```json
{
  "next": "^14.0.0",
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "typescript": "^5.0.0"
}
```

### State & Data

```json
{
  "@reduxjs/toolkit": "^2.0.0",
  "react-redux": "^9.0.0",
  "redux-persist": "^6.0.0",
  "axios": "^1.6.0"
}
```

### UI & Styling

```json
{
  "tailwindcss": "^3.4.0",
  "@radix-ui/react-avatar": "^1.0.4",
  "@radix-ui/react-dropdown-menu": "^2.0.6",
  "@radix-ui/react-alert-dialog": "^1.0.5",
  "lucide-react": "^0.300.0",
  "class-variance-authority": "^0.7.0",
  "clsx": "^2.0.0",
  "tailwind-merge": "^2.0.0"
}
```

### Real-time & Notifications

```json
{
  "socket.io-client": "^4.8.3",
  "react-hot-toast": "^2.4.1"
}
```

---

## 📝 Scripts

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint"
}
```

---

## Common Issues

### Issue: Hydration Errors

**Solution**: Ensure client and server render same content

```typescript
"use client"; // Add to components using browser APIs
```

### Issue: Redux Persist Warning

**Solution**: Already configured with serialization check ignored

### Issue: Socket Not Connecting

**Solution**: Check NEXT_PUBLIC_API_URL and backend CORS settings

---

# Calendly Clone - Scheduling & Booking Application

A full-stack scheduling web application that replicates Calendly's design and user
experience. Built for seamless event management, availability configuration, and
public booking flows.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)
![Node](https://img.shields.io/badge/Node.js-Express-green.svg)
![Database](https://img.shields.io/badge/Database-PostgreSQL-blue.svg)
![Prisma](https://img.shields.io/badge/ORM-Prisma-2D3748.svg)

## Table of Contents
- [Overview](#overview)
- [Key Features](#key-features)
- [System Architecture](#system-architecture)
- [Database Design](#database-design)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Assumptions](#assumptions)

---

## Overview

This Calendly Clone addresses the need for a clean, functional scheduling system
where a host can define event types, set weekly availability, and share public
booking links — while invitees can book time slots without needing an account.

### Problem Statement
- Scheduling meetings manually leads to back-and-forth communication
- No centralized way to manage availability and prevent double bookings
- Lack of a clean public-facing booking experience for invitees

### Solution
A full-stack booking platform where the host configures event types and availability
through an admin dashboard, and invitees book via a public link — with automatic
conflict prevention and a confirmation flow.

<img width="1917" height="909" alt="Screenshot 2026-03-28 222155" src="https://github.com/user-attachments/assets/66d5d914-9367-4644-96cb-486d9a453d7b" />

<img width="1919" height="918" alt="Screenshot 2026-03-28 222210" src="https://github.com/user-attachments/assets/519bbb93-dce0-4ca7-9075-16555fd297d9" />


<img width="1917" height="919" alt="Screenshot 2026-03-28 222234" src="https://github.com/user-attachments/assets/b0b7832a-1ead-489b-9c43-5e815bfac68d" />



---

## Key Features

### Event Types Management
- Create, edit, and delete event types
- Set name, duration (15 / 30 / 45 / 60 min), color, and unique URL slug
- Each event type generates a shareable public booking link

### Availability Settings
- Configure available days (Monday – Sunday toggle)
- Set time ranges per day (e.g., 9:00 AM – 5:00 PM)
- Timezone selector for accurate slot generation

### Public Booking Page
- Month calendar view with available dates highlighted
- Time slot grid generated from availability minus existing bookings
- Booking form: invitee name, email, optional notes
- Double booking prevention enforced at the database level
- Redirects to confirmation page after successful booking

### Meetings Dashboard
- View Upcoming, Past, and Cancelled meetings in tabs
- Cancel any scheduled meeting with confirmation dialog
- Seeded with sample data for immediate testing

---

## System Architecture
```
┌─────────────────────────────────────────────────────┐
│                   Next.js 14 Frontend                │
│         (App Router, Tailwind CSS, shadcn/ui)        │
│                                                      │
│   /event-types   /availability   /meetings           │
│   /book/[slug]   /book/[slug]/confirmed              │
└───────────────────────┬─────────────────────────────┘
                        │ REST API calls
                        ▼
┌─────────────────────────────────────────────────────┐
│              Express.js Backend (Port 3001)          │
│                                                      │
│   Routes → Controllers → Services → Prisma ORM      │
└───────────────────────┬─────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────┐
│              PostgreSQL Database                     │
│     User | EventType | Availability | Meeting        │
└─────────────────────────────────────────────────────┘
```

---

## Database Design

### Schema Overview
```prisma
model User {
  id           String         @id @default(uuid())
  name         String
  email        String         @unique
  timezone     String         @default("America/New_York")
  eventTypes   EventType[]
  availability Availability[]
  createdAt    DateTime       @default(now())
}

model EventType {
  id          String    @id @default(uuid())
  userId      String
  user        User      @relation(fields: [userId], references: [id])
  name        String
  slug        String    @unique
  description String?
  duration    Int       // in minutes: 15, 30, 45, 60
  color       String    @default("#006BFF")
  isActive    Boolean   @default(true)
  meetings    Meeting[]
  createdAt   DateTime  @default(now())
}

model Availability {
  id        String  @id @default(uuid())
  userId    String
  user      User    @relation(fields: [userId], references: [id])
  dayOfWeek Int     // 0 = Sunday, 6 = Saturday
  startTime String  // "09:00"
  endTime   String  // "17:00"
  isActive  Boolean @default(true)
}

model Meeting {
  id           String        @id @default(uuid())
  eventTypeId  String
  eventType    EventType     @relation(fields: [eventTypeId], references: [id])
  inviteeName  String
  inviteeEmail String
  inviteeNotes String?
  startTime    DateTime
  endTime      DateTime
  status       MeetingStatus @default(SCHEDULED)
  createdAt    DateTime      @default(now())
}

enum MeetingStatus {
  SCHEDULED
  CANCELLED
}
```

### Relationships
- One `User` → many `EventType` records
- One `User` → many `Availability` records (one per day of week)
- One `EventType` → many `Meeting` records
- Meetings reference EventType to inherit duration and host info

---

## Installation

### Prerequisites
- Node.js 18+
- PostgreSQL (local) or a Neon account (cloud)
- npm or yarn

---

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/calendly-clone.git
cd calendly-clone
```

---

### 2. Setup Environment Variables

Create a `.env` file in the root of the project:
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/calendly?schema=public"
```

If using Neon (recommended for deployment):
```env
DATABASE_URL="postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require"
```

---

### 3. Install Dependencies

**Frontend (Next.js)**
```bash
npm install
```

**Backend (Express)**
```bash
cd server
npm install
```

---

### 4. Setup Database
```bash
# Run migrations
npx prisma migrate dev --name init

# Seed with sample data
npx prisma db seed
```

Seed creates:
- 1 default user (Alex Johnson)
- 3 event types: "Quick 15 Min Chat", "30 Min Meeting", "60 Min Deep Dive"
- Availability: Monday – Friday, 9:00 AM – 5:00 PM
- 4 sample meetings (2 upcoming, 2 past)

---

### 5. Run the Application

**Start Backend (Terminal 1)**
```bash
cd server
npm run dev
# Runs on http://localhost:3001
```

**Start Frontend (Terminal 2)**
```bash
npm run dev
# Runs on http://localhost:3000
```

Open **http://localhost:3000** — redirects to `/event-types` automatically.

---

## Usage

### Admin Side (No Login Required)
| Page | URL | Description |
|------|-----|-------------|
| Event Types | `/event-types` | Create, edit, delete event types |
| Availability | `/availability` | Set weekly schedule and timezone |
| Meetings | `/meetings` | View and cancel scheduled meetings |

### Public Side
| Page | URL | Description |
|------|-----|-------------|
| Booking Page | `/book/[slug]` | Select date and time slot, fill form |
| Confirmation | `/book/[slug]/confirmed` | Booking details after successful booking |

---

## API Documentation

### Event Types
```
GET    /api/event-types          → Get all event types
POST   /api/event-types          → Create a new event type
PUT    /api/event-types/:id      → Update an event type
DELETE /api/event-types/:id      → Delete an event type
```

### Availability
```
GET    /api/availability         → Get weekly availability
PUT    /api/availability         → Update availability settings
```

### Public Booking
```
GET    /api/public/event/:slug              → Get event type by slug
GET    /api/public/event/:slug/slots?date=  → Get available time slots for a date
POST   /api/public/event/:slug/book         → Create a booking
```

### Meetings
```
GET    /api/meetings             → Get all meetings (filter: ?status=upcoming/past)
DELETE /api/meetings/:id         → Cancel a meeting
```

### Response Format
All endpoints return a consistent shape:
```json
// Success
{ "success": true, "data": {} }

// Error
{ "success": false, "error": "Human readable message" }
```

---

## Project Structure
```
calendly-clone/
├── app/                          # Next.js App Router pages
│   ├── (dashboard)/
│   │   ├── event-types/page.tsx
│   │   ├── availability/page.tsx
│   │   ├── meetings/page.tsx
│   │   └── layout.tsx            # Sidebar layout
│   └── book/[slug]/
│       ├── page.tsx              # Public booking page
│       └── confirmed/page.tsx    # Confirmation page
│
├── components/
│   ├── ui/                       # shadcn/ui primitives
│   └── features/
│       ├── event-types/          # EventCard, CreateEventModal
│       ├── availability/         # WeeklySchedule, DayRow
│       ├── booking/              # CalendarPicker, TimeSlotGrid, BookingForm
│       └── meetings/             # MeetingRow, MeetingTabs
│
├── hooks/                        # Data fetching hooks
│   ├── useEventTypes.ts
│   ├── useAvailability.ts
│   └── useMeetings.ts
│
├── lib/
│   ├── api.ts                    # Centralized API calls
│   ├── utils.ts                  # Helper functions
│   └── validations.ts            # Zod schemas
│
├── types/
│   └── index.ts                  # TypeScript interfaces
│
└── server/
    ├── index.ts                  # Express entry point
    ├── routes/                   # Route definitions
    ├── controllers/              # Request/response handlers
    ├── services/                 # Business logic
    └── prisma/
        ├── schema.prisma
        └── seed.ts
```

---

## Assumptions

- A single default user (Alex Johnson) is always logged in — no authentication implemented
- Availability is weekly (same schedule repeats every week) — no date-specific overrides
- All times are stored in UTC in the database and converted to the user's timezone on display
- Slot generation interval matches the event type duration (e.g., 30 min event = slots at 9:00, 9:30, 10:00...)
- Cancellation is soft — status is updated to CANCELLED, record is not deleted
- Public booking page is accessible to anyone with the event slug URL
- No email notifications implemented — confirmation is shown on-screen only

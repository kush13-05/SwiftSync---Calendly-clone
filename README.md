# Calendly Clone

A full-stack scheduling app built with Next.js 14, Express.js, PostgreSQL, and Prisma.

## Tech Stack
- **Frontend**: Next.js 14 (App Router), Tailwind CSS, shadcn/ui, TanStack Query
- **Backend**: Express.js (runs on port 3001)
- **Database**: PostgreSQL + Prisma ORM
- **Forms**: React Hook Form + Zod
- **Dates**: date-fns

---

## Setup Instructions

### 1. Install PostgreSQL
Download and install PostgreSQL from https://www.postgresql.org/download/
Create a database named `calendly`:
```bash
psql -U postgres -c "CREATE DATABASE calendly;"
```

### 2. Configure Environment
Edit `.env` with your database credentials:
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/calendly?schema=public"
PORT=3001
```

### 3. Run Database Migrations
```bash
npx prisma migrate dev --name init
```

### 4. Seed the Database
```bash
npx prisma db seed
```
This creates: 1 user, 3 event types, Mon-Fri 9-5 availability, and 4 meetings.

### 5. Start the Express API Server
Open a terminal and run:
```bash
npm run server:dev
```
The API will be available at http://localhost:3001

### 6. Start the Next.js Frontend
Open another terminal and run:
```bash
npm run dev
```
The app will be available at http://localhost:3000

---

## Routes

### Dashboard (requires both servers running)
| URL | Page |
|-----|------|
| `/event-types` | Create & manage event types |
| `/availability` | Set weekly schedule |
| `/meetings` | View & cancel meetings |

### Public Booking
| URL | Page |
|-----|------|
| `/book/30-min` | Book the "30 Min Meeting" event |
| `/book/15-min` | Book the "15 Min Meeting" event |
| `/book/60-min` | Book the "60 Min Meeting" event |

---

## Architecture

```
3 layers — kept completely separate:

Route      = "what URL triggers this?"
Controller = "what comes in / goes out?"
Service    = "how do we get / store the data?"
```

### Key Files
- `server/services/slotService.ts` — Slot generation logic (6 clear steps)
- `src/lib/api.ts` — All API calls in one place
- `src/hooks/` — One hook per feature, wraps TanStack Query
- `src/components/features/` — Business UI components (props in → JSX out)

---

## If Something Breaks

| Problem | What to check |
|---------|---------------|
| "Failed to load" errors | Is the Express server running on port 3001? |
| Database errors | Is PostgreSQL running? Are migrations run? |
| "No slots available" | Is it a weekend or after 5PM? Try a weekday. |
| Prisma errors | Run `npx prisma generate` to regenerate the client |

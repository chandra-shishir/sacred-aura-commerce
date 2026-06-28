#  Implementation Plan

Four tasks, sequenced so each can be shipped and reviewed independently.

---

## Task 1 — Vastu category, products & MegaMenu refactor

### Database migration

Add `Vastu` as a top-level category (if not already present) and seed 25 products under it:


| Product                     | Slug                        |
| --------------------------- | --------------------------- |
| Three Legged Frog With Coin | three-legged-frog-with-coin |
| Copper Swastik Pyramid      | copper-swastik-pyramid      |
| Lucky Brass Hanging         | lucky-brass-hanging         |
| Kuber Yantra                | kuber-yantra                |
| Shree Yantra                | shree-yantra                |
| Bells & Coins               | bells-and-coins             |
| Brass Elephant Pair         | brass-elephant-pair         |
| Helix Vaastu Dosh Nivaran   | helix-vaastu-dosh-nivaran   |
| Copper Vastu Helix          | copper-vastu-helix          |
| Brass Vastu Helix           | brass-vastu-helix           |
| Aluminium Vastu Helix       | aluminium-vastu-helix       |
| Mahavastu Metal Strips      | mahavastu-metal-strips      |
| Black Horse Shoe            | black-horse-shoe            |
| Nazar Battu                 | nazar-battu                 |
| Brass Sun                   | brass-sun                   |
| Wind Chimes                 | wind-chimes                 |
| Feng Shui Crystal Pyramid   | feng-shui-crystal-pyramid   |
| Study Pyramid               | study-pyramid               |
| Swastik Symbol              | swastik-symbol              |
| Om Symbol                   | om-symbol                   |
| Bagua / Pakua Mirror        | bagua-pakua-mirror          |
| Vastu Purush                | vastu-purush                |
| Pyrite / Evil Eye Frame     | pyrite-evil-eye-frame       |
| Para Shivling               | para-shivling               |
| Sphatik Shivling            | sphatik-shivling            |


**Schema for each product:**

```sql
category       = 'Vastu'
slug           = '<see table above>'
name           = '<product name>'
price          = <selling price INR>
mrp            = <MRP INR>
image_url      = 'https://picsum.photos/seed/<slug>/600/600'
short_desc     = '<one-line spiritual meaning>'
benefits       = ARRAY['<benefit 1>', '<benefit 2>', '<benefit 3>']

```

> **Image placeholders:** Use `picsum.photos/seed/<slug>/600/600` — deterministic per slug, no API key, no redirects. Do **not** use `source.unsplash.com/featured/` — those URLs are deprecated and redirect unreliably.

All products must render correctly on the existing `/vastu/:slug` PDP without any template changes.

---

### MegaMenu refactor — accordion multilevel dropdown

Replace the current 2-pane hover layout with an accordion-style dropdown that works on both desktop and mobile.

**Behaviour rules:**

- **Desktop (hover):** Hovering a parent row expands its children inline with a smooth height transition. Only one parent is expanded at a time — hovering a new parent collapses the previous one.
- **Mobile (tap):** Tapping a parent row toggles its children open/closed. Multiple parents can be open simultaneously.
- No JS framework required — CSS-driven expand/collapse with a lightweight toggle for mobile tap state.
- Children render as a flat indented list under their parent, not in a separate pane.
- The active category is visually highlighted (border-left accent, slightly bolder weight).

---

## Task 2 & 3 — Dowsing category, crystal filter & shop sidebar refactor

### Database migration

**New category: Dowsing** (top-level, same level as Vastu and Crystals)

Seed 6 products:


| Product           | Slug              |
| ----------------- | ----------------- |
| Dowsers           | dowsers           |
| Dowsing Rods      | dowsing-rods      |
| Tensor Rings      | tensor-rings      |
| Copper Generators | copper-generators |
| Harmonizers       | harmonizers       |
| Succor Punch      | succor-punch      |


> Note: "Succor Punch" is the correct product name (not "Sucker Punch").

Image placeholders: `picsum.photos/seed/<slug>/600/600`

**New column on** `products`**:**

```sql
ALTER TABLE products ADD COLUMN crystal_type TEXT;

```

Tag all existing crystal products with one of: `Amethyst`, `Clear Quartz`, `Rose Quartz`, `Citrine`, `Tiger Eye`, `Selenite`, `Black Tourmaline`. Dowsing and Vastu products leave this column null.

---

### Shop sidebar refactor (`src/pages/Shop.tsx`)

Replace the current sidebar with shadcn `Accordion`, one section per filter group:

1. **Category** — checkbox list of all top-level categories
2. **Price** — min/max range slider
3. **Crystal Type** — checkbox list; visible when "All" is selected or when a crystal-adjacent category (Crystals, Healing Stones) is active. Hidden when only Vastu or Dowsing is selected.
4. **Sort** — radio group (Relevance, Price: Low to High, Price: High to Low, Newest)

Extend `useProducts` hook to accept a `crystalType: string | null` parameter and filter accordingly.

**Edge case:** When no category filter is set (default "All" view), Crystal Type must be visible. Do not hide it just because a non-crystal category exists in the list.

---

## Task 4 — Udemy-style course platform

### Database migration (single call)

```sql
-- Modules and lessons
CREATE TABLE course_modules (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id   UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  position    INT NOT NULL,
  summary     TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE course_lessons (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id        UUID NOT NULL REFERENCES course_modules(id) ON DELETE CASCADE,
  title            TEXT NOT NULL,
  position         INT NOT NULL,
  video_url        TEXT,
  pdf_url          TEXT,
  live_class_url   TEXT,
  duration_seconds INT,
  is_preview       BOOLEAN DEFAULT FALSE,
  created_at       TIMESTAMPTZ DEFAULT now()
);

-- Lesson progress (required for resume + progress bars)
CREATE TABLE lesson_progress (
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id    UUID NOT NULL REFERENCES course_lessons(id) ON DELETE CASCADE,
  watch_seconds INT DEFAULT 0,
  completed    BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  PRIMARY KEY (user_id, lesson_id)
);

-- Enrollments
CREATE TABLE course_enrollments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id   UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  status      TEXT NOT NULL DEFAULT 'active',
  enrolled_at TIMESTAMPTZ DEFAULT now(),
  expires_at  TIMESTAMPTZ
);

-- Announcements (Student Bulletin Board)
CREATE TABLE course_announcements (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id  UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  author_id  UUID NOT NULL REFERENCES auth.users(id),
  title      TEXT NOT NULL,
  body       TEXT NOT NULL,
  pinned     BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now()
);

```

**Storage buckets:**


| Bucket              | Access  |
| ------------------- | ------- |
| `course-videos`     | Private |
| `course-resources`  | Private |
| `course-thumbnails` | Public  |


**RLS policies:**

```sql
-- Lessons: readable only to enrolled users (with valid, non-expired enrollment) or admins
-- CRITICAL: expires_at check must be included
CREATE POLICY "lesson_read" ON course_lessons FOR SELECT
  USING (
    is_preview = TRUE
    OR has_role(auth.uid(), 'admin')
    OR EXISTS (
      SELECT 1 FROM course_enrollments e
      JOIN course_modules m ON m.id = course_lessons.module_id
      WHERE e.user_id = auth.uid()
        AND e.course_id = m.course_id
        AND e.status = 'active'
        AND (e.expires_at IS NULL OR e.expires_at > now())
    )
  );

-- Announcements: readable to enrolled users (same expiry check)
-- Admins: full access via has_role(uid, 'admin') on all new tables
-- GRANT SELECT, INSERT, UPDATE, DELETE ON all new tables TO authenticated;

```

> **Enrollment expiry is enforced in RLS** — the `expires_at IS NULL OR expires_at > now()` check is mandatory. A row existing in `course_enrollments` is not sufficient on its own.

---

### Signed URL strategy

Private video and PDF storage uses Supabase signed URLs with a **1-hour TTL**. The lesson player must:

1. Request a fresh signed URL when the lesson is first opened.
2. Re-request a signed URL if the player emits a network error consistent with URL expiry (403/401).
3. Never store signed URLs in client state that persists across sessions.

---

### Learner UI — `/courses/:slug/learn`

**Layout:**

- Left rail (collapsible on mobile): module/lesson accordion. Each lesson shows title, duration, completion checkmark, and a lock icon if not enrolled.
- Main pane: HTML5 `<video>` fed by a fresh signed URL on lesson select. Below the player: PDF download list + live class join button (shown only when `live_class_url` is set and the class time is within 15 minutes or currently live).

**Progress:**

- On play, begin writing `watch_seconds` to `lesson_progress` every 30 seconds via upsert.
- On video end, set `completed = TRUE` and `completed_at = now()`.
- Left rail reflects completed state (checkmark) immediately on update.
- Module shows an aggregate progress bar (completed lessons / total lessons).

**Student Bulletin Board:**

- Component rendered below the video player.
- Fetches announcements for the current course, pinned first, then by `created_at DESC`.
- Realtime subscription via Supabase `SUBSCRIBE` — new announcements appear without refresh.

---

### Marketing page — `/courses/:slug`

No changes to the existing layout. Swap the "Enroll" CTA to call the existing `/course-checkout/:slug` page. On successful checkout, insert a row into `course_enrollments` with `status = 'active'` and `expires_at` set per the course's access duration (null = lifetime).

---

### Admin UI — `/admin` → Courses tab

**Module/lesson builder:**

- Create, reorder (drag handle), and delete modules.
- Within each module: create, reorder, and delete lessons.
- Per-lesson fields: title, video upload (to `course-videos` bucket), PDF upload (to `course-resources` bucket), live class URL (plain text field — Zoom/Meet/etc.), duration (auto-detected from video metadata on upload), preview toggle, publish toggle.

**Announcement composer:**

- Title + body fields.
- Pin toggle.
- Publishes immediately to the bulletin board via insert.

---

## Confirmed decisions


| Decision           | Choice                                                                                                                                                                   |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Payments           | Keep existing mock `CourseCheckout` for now. Real Razorpay wiring (preferred over Stripe for Indian market — UPI support, simpler KYC) can be added as a follow-up task. |
| Live class links   | Plain URL field (Zoom/Meet/etc.) pasted by admin. No third-party integration.                                                                                            |
| Image placeholders | `picsum.photos/seed/<slug>/600/600` — not Unsplash source URLs.                                                                                                          |


---

## Order of execution

1. **Task 1** — Vastu migration (category + 25 products) + MegaMenu accordion refactor.
2. **Task 2/3** — `crystal_type` column + Dowsing seed + Shop accordion sidebar.
3. **Task 4** — Course platform migration (all 5 tables + buckets + RLS), then learner UI + progress tracking, then admin builder.
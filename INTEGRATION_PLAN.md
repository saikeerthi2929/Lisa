# Project Integration Analysis - LISA Backend Sync

## 1. Project Structure Overview
The project is currently divided into two main sections:
- **Unified RBAC System (Root)**: Contains `auth.js` which manages `citizen`, `student`, and `admin` roles using `localStorage`.
- **Modular Student Hub (pages/)**: A specialized set of pages for law students that currently operates independently of the root authentication system.
- **Data Layer (data/)**: JSON files serving as a shared database for legal acts, case summaries, and quizzes.

## 2. Updated Backend Analysis
The "backend" is currently implemented as a client-side manager (`auth.js`) that persists data to `localStorage`. 
- **User Data**: Stored as JSON strings in `userData`.
- **Session**: Managed via `userRole`.

## 3. Integration Points (Current & Proposed)

### A. Authentication & Access Control
- **Current**: Root pages (`dashboard.html`, `lawyer.html`, etc.) are protected.
- **Gap**: Modular pages (`pages/*.html`) bypass the authentication check.
- **Proposed Action**: Inject `auth.js` into all `pages/` files and configure `RoleConfig.student` to include these pages.

### B. User Data Synchronization
- **Current**: `js/dashboard.js` uses a static `userState` object.
- **Proposed Action**: Replace static mock data with dynamic data from `AuthManager.getUserData()`.

### C. Navigation Consistency
- **Current**: `index.html` points to `pages/dashboard.html` while the unified `dashboard.html` points to `student.html`.
- **Proposed Action**: Standardize on the modular `pages/` system as the primary Student Mode or vice-versa, depending on design preference. (Modular is more robust).

### D. Data Fetching
- **Current**: Modular pages fetch from `../data/*.json`.
- **Status**: Correct and functional. No change needed.

## 4. Sync Progress
- [x] Inject `auth.js` into modular student pages.
- [x] Map `AuthManager` data to modular dashboards.
- [x] Align sidebar navigation across both systems (via `auth.js` dynamic generation).
- [x] Consolidate Student Mode path (Standardized on modular pages with root entry).

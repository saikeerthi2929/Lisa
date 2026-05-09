# LISA - Role-Based Access Control Implementation

## Overview
This document describes the role-based authentication and access control system implemented for the LISA Legal Assistant application.

## Files Created/Modified

### 1. auth.js (NEW)
- **Purpose**: Core authentication and role management
- **Key Functions**:
  - `AuthManager.setUser(role, userData)` - Save user role and data to localStorage
  - `AuthManager.getRole()` - Get current user's role
  - `AuthManager.logout()` - Clear session and redirect to home
  - `checkPageAccess()` - Verify user has permission to view current page
  - `initRoleBasedUI()` - Customize UI based on user role

### 2. Role Configurations

#### Citizen Role
- **Allowed Pages**: dashboard.html, lawyer.html, chat.html, vault.html
- **Sidebar Navigation**:
  - Dashboard
  - AI Lawyer
  - Legal Chatbot
  - Evidence Vault
- **Default Dashboard View**: Citizen panel

#### Student Role
- **Allowed Pages**: dashboard.html, student.html
- **Sidebar Navigation**:
  - Dashboard
  - Learning Mode
  - Case Library
  - Practice Tests
- **Default Dashboard View**: Student panel
- **Restrictions**: Cannot access AI Lawyer, Chatbot, or Evidence Vault

#### Admin Role
- **Allowed Pages**: All pages
- **Sidebar Navigation**:
  - Dashboard
  - Admin Panel
  - User Management
  - Analytics
- **Special Features**: Can switch between all dashboard views

## User Flow

### Registration Flow
1. User visits `register.html` and selects role (Citizen or Student)
2. User fills out role-specific registration form:
   - **Citizen**: Name, Email, Phone (optional), Password
   - **Student**: Name, College, Student ID, Email, Password
3. On successful validation, user data is saved to localStorage with role
4. User is redirected to `dashboard.html`

### Login Flow (Simulated)
- Currently uses registration as login
- Role and user data stored in localStorage
- Persists across page refreshes

### Dashboard Access
1. User navigates to dashboard
2. `auth.js` checks if user is logged in
3. If not logged in → redirect to `index.html`
4. If logged in → customize UI based on role:
   - Update sidebar navigation
   - Show appropriate dashboard panel
   - Hide role switcher for non-admin users
   - Display user name and role in footer

### Page Access Control
1. Every protected page loads `auth.js`
2. `checkPageAccess()` runs on page load
3. Verifies current page is in user's allowed pages list
4. If access denied → alert user and redirect to dashboard

## Implementation Status

### ✅ Completed
- [x] Created auth.js with role management
- [x] Updated citizen registration form
- [x] Updated student registration form
- [x] Added auth.js to dashboard.html
- [x] Role-based sidebar navigation
- [x] Page access restrictions
- [x] User data persistence

### 📝 Next Steps
1. Add auth.js to all protected pages (lawyer.html, chat.html, vault.html, student.html)
2. Add logout button to sidebar footer
3. Create actual login page (currently using registration)
4. Add session timeout functionality
5. Implement backend authentication (currently client-side only)

## Usage Instructions

### For Testing
1. Open `register.html`
2. Select "Citizen" or "Law Student"
3. Fill out the form and submit
4. You'll be redirected to dashboard with role-specific UI
5. Try navigating to different pages to see access control

### To Add Auth to New Pages
Add this line before closing `</body>` tag:
```html
<script src="auth.js"></script>
```

### To Check User Role in JavaScript
```javascript
const role = AuthManager.getRole();
if (role === 'citizen') {
    // Citizen-specific code
} else if (role === 'student') {
    // Student-specific code
}
```

## Security Notes
⚠️ **Important**: Current implementation uses localStorage for demo purposes only.
- Data is stored client-side and can be manipulated
- No actual server-side authentication
- For production, implement:
  - Server-side session management
  - JWT tokens
  - Secure password hashing
  - HTTPS encryption
  - CSRF protection

## File Locations
- `c:/Users/Harini Katta/OneDrive/Desktop/lisa/auth.js`
- `c:/Users/Harini Katta/OneDrive/Desktop/lisa/register_citizen.html`
- `c:/Users/Harini Katta/OneDrive/Desktop/lisa/register_student.html`
- `c:/Users/Harini Katta/OneDrive/Desktop/lisa/dashboard.html`

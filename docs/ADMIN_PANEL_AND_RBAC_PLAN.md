# Comprehensive Admin Panel & RBAC Architecture Plan
**Project:** cuttingedger.com (Laravel 12 / PHP 8.4 + Inertia React + Tailwind CSS v4)  
**Status:** Architecture & Implementation Blueprint (Plan Only)

---

## 1. Executive Summary & Goals

This plan outlines the design and step-by-step implementation of a modern, consistent, and scalable **Admin Panel** for `cuttingedger.com`.

### Core Requirements:
1. **Role-Based Access Control (RBAC):**
   - Three distinct hierarchical roles:
     - **Super Admin**: Complete system control, user & role lifecycle management, system settings, database logs, and activity audit trails.
     - **Admin**: Content and entity CRUD operations (Projects, Services, Team Members, Clients, Testimonials, Blog Posts, Careers, FAQ, Pricing, Contact Messages, Newsletter). Cannot manage Super Admin accounts.
     - **User / Editor**: Restricted management (e.g., draft creation, profile settings, or viewing read-only resources).
   - Super Admin can create, edit, activate/deactivate, and assign roles to other users.
2. **Unified Component-Driven Architecture:**
   - Standardized reusable UI modules: Data Tables (with sorting, filtering, batch actions, pagination), Modal forms, Drawer panels, Metric stats cards, Media uploaders, and Confirmation dialogs.
3. **Design Consistency (Tailwind CSS v4 & Cutting-Edge Dark Theme):**
   - Match the site's signature aesthetic: `#0a0b0e` / `#12141a` surfaces, neon lime accent (`#d4ff00`), crisp monospace metadata tags, and smooth micro-interactions.
4. **Full CRUD Module Coverage:**
   - Dedicated modules for all existing models:
     - `User & Role Management`
     - `Projects (Portfolio)`
     - `Services & Disciplines`
     - `Team Members`
     - `Clients & Marquee Logos`
     - `Testimonials`
     - `Blog Posts & Categories`
     - `Career Openings`
     - `Pricing Plans`
     - `FAQ Items`
     - `Contact Messages (Inquiries Inbox)`
     - `Newsletter Subscribers`
     - `System & SEO Settings`

---

## 2. Database Schema & Role Management Design

### 2.1 Role & User Architecture

We will implement an extensible, clean database schema using either an enum/role table or a dedicated roles & permissions structure. To meet the explicit requirement of a role table with user-role association:

#### Tables:
1. `roles`
   - `id`: bigint, PK
   - `name`: string (e.g., `super_admin`, `admin`, `user`)
   - `label`: string (e.g., `Super Admin`, `Admin`, `User / Staff`)
   - `description`: string, nullable
   - `created_at`, `updated_at`

2. `users` (Extend existing migration or add a new migration):
   - Add `role_id`: foreignId constrained to `roles(id)` on default `user`
   - Add `status`: enum or string (`active`, `suspended`, `invited`)
   - Add `avatar`: string, nullable
   - Add `last_login_at`: timestamp, nullable
   - Add `phone`: string, nullable

3. `activity_logs` (Optional / Recommended for Super Admin):
   - `id`: bigint, PK
   - `user_id`: foreignId constrained to `users`
   - `action`: string (e.g., `create`, `update`, `delete`, `login`)
   - `module`: string (e.g., `projects`, `users`, `settings`)
   - `target_id`: string/bigint, nullable
   - `metadata`: json, nullable (stores before/after diffs or IP address)
   - `created_at`

### 2.2 Seeders & Default Accounts
- Pre-populate roles:
  - `super_admin` (Level 100)
  - `admin` (Level 50)
  - `user` (Level 10)
- Super Admin seeder with environment-based credentials (`ADMIN_DEFAULT_EMAIL`, `ADMIN_DEFAULT_PASSWORD`).

---

## 3. Backend Architecture & Security (Laravel 12 / PHP 8.4)

### 3.1 Middleware & Route Protection
- **`Authenticate`**: Standard Laravel session authentication.
- **`EnsureUserHasRole` middleware**:
  ```php
  Route::middleware(['auth', 'role:super_admin,admin'])->prefix('admin')->name('admin.')->group(function () {
      // Shared Admin + Super Admin Routes (Content CRUDs)
      Route::resource('projects', AdminProjectController::class);
      Route::resource('services', AdminServiceController::class);
      Route::resource('team', AdminTeamMemberController::class);
      Route::resource('clients', AdminClientController::class);
      Route::resource('testimonials', AdminTestimonialController::class);
      Route::resource('posts', AdminPostController::class);
      Route::resource('careers', AdminCareerOpeningController::class);
      Route::resource('pricing', AdminPricingPlanController::class);
      Route::resource('faqs', AdminFaqController::class);
      Route::resource('messages', AdminContactMessageController::class)->only(['index', 'show', 'destroy', 'update']);
      Route::resource('subscribers', AdminSubscriberController::class)->only(['index', 'destroy', 'store']);
      Route::get('settings', [AdminSettingController::class, 'index'])->name('settings.index');
      Route::post('settings', [AdminSettingController::class, 'update'])->name('settings.update');

      // Super Admin Exclusive Routes
      Route::middleware('role:super_admin')->group(function () {
          Route::resource('users', AdminUserController::class);
          Route::post('users/{user}/toggle-status', [AdminUserController::class, 'toggleStatus'])->name('users.toggle-status');
          Route::get('logs', [AdminLogController::class, 'index'])->name('logs.index');
      });
  });
  ```

### 3.2 Form Requests & Policies
- Strict validation rules per module via dedicated Form Request classes:
  - `StoreUserRequest`, `UpdateUserRequest`
  - `StoreProjectRequest`, `UpdateProjectRequest`
  - `StoreServiceRequest`, `UpdateServiceRequest`
- Policy rules:
  - `UserPolicy`: Prevent non-super-admins from editing user roles or modifying Super Admin accounts; prevent super admins from deleting their own active account.

---

## 4. Frontend Component-Driven Modular Architecture (React + Inertia + Tailwind CSS + shadcn/ui)

### 4.1 UI Architecture Decision: Scoped shadcn/ui for Admin Panel
- **Scope**: **shadcn/ui** is exclusively adopted for the **Admin Panel** to provide production-grade, accessible, battle-tested UI primitives (dialogs, dropdowns, popovers, command palette, tabs, form controls).
- **Public Website Boundary**: The public agency site remains bespoke and handcrafted to maintain its unique artistic branding, high-concept animations, and custom typography without framework overhead.
- **Visual Styling & Theme Tokens**:
  - Configured with official `components.json` using Tailwind CSS v4 CSS variables.
  - Themed directly with the studio’s signature high-contrast dark aesthetic: deep obsidian surfaces (`#0a0b0e`, `#12141a`), subtle borders (`rgba(255,255,255,0.08)`), and electric neon lime (`#d4ff00`) accents for focused states, buttons, and active indicators.

### 4.2 Admin Layout & Shell (`resources/js/Layouts/Admin/AdminLayout.tsx`)
- **AdminSidebar**: Collapsible drawer with grouped navigation:
  - *Overview*: Dashboard, Metrics
  - *Portfolio & Content*: Projects, Services, Blog Posts, Categories
  - *Agency & Team*: Team Members, Testimonials, Clients, Careers
  - *Interactions*: Inquiries Inbox (with unread badge counter), Newsletter Subscribers
  - *System (Super Admin)*: User Management, Roles & Permissions, Global Settings, System Logs
- **AdminHeader**:
  - Global Search (quick command palette `Cmd+K` powered by shadcn's `Command` component for fast switching between modules)
  - Breadcrumbs navigation (`Breadcrumb` primitive)
  - Quick action "+ Create New" dropdown (`DropdownMenu` primitive)
  - User profile dropdown (Avatar, Role badge, Switch to Client View, Logout)
- **Flash Notifications / Toast Manager**:
  - Using shadcn `Sonner` or `Toast` for reactive, auto-dismissing notifications dispatched on Inertia flash events.

### 4.3 Core Reusable Admin UI Components (`resources/js/Components/Admin/UI/` & `resources/js/Components/ui/`)
1. **`DataTable` (shadcn + TanStack Table)**:
   - Reusable across all CRUD modules with column sorting, live filtering, column visibility toggles, row selection for batch deletion, and pagination.
2. **`AdminPageHeader.tsx`**:
   - Standardized page header with title, subtitle, breadcrumb, badge, and primary action button (e.g. "+ Add Project").
3. **Form Controls (`Form`, `Input`, `Select`, `Textarea`, `Switch`, `Checkbox`)**:
   - Consistent validation states, labels, and error messages powered by shadcn primitives.
4. **`AdminRichEditor.tsx` / `AdminMarkdown.tsx`**:
   - For blog posts, project summaries, and job descriptions.
5. **`AdminMediaUpload.tsx`**:
   - Drag-and-drop file uploader with live preview, dimension checks, and media library picker.
6. **`AdminConfirmModal.tsx` (`AlertDialog` primitive)**:
   - Accessible confirmation modal for destructive actions (e.g., "Are you sure you want to delete this project?").
7. **Authentication**:
   - Clean, lightweight custom auth flow (Session / Fortify backend) with a sleek dedicated admin login page (`/admin/login`).

---

## 5. Detailed Breakdown of CRUD Modules

| Module | Route / URI | Key Attributes Managed | Authorized Roles |
|---|---|---|---|
| **User & Role Management** | `/admin/users` | Name, Email, Password, Role, Status (`active`/`suspended`), Avatar | **Super Admin only** |
| **Projects (Work)** | `/admin/projects` | Title, Slug, Category, Client, Year, Summary, Description, Cover Image, Gallery JSON, Deliverables, Metrics, Featured, Sort Order | Super Admin, Admin |
| **Services** | `/admin/services` | Title, Slug, Marquee Label, Subtitle, Description, Features, Deliverables, Icon, Accent Color, Sort Order | Super Admin, Admin |
| **Team Members** | `/admin/team` | Name, Slug, Role, Since Year, Bio, Avatar, Social Links, Featured, Sort Order | Super Admin, Admin |
| **Clients & Marquee** | `/admin/clients` | Name, Dark/Light Logos, URL, Marquee Row (1 or 2), Sort Order | Super Admin, Admin |
| **Testimonials** | `/admin/testimonials` | Client Name, Role, Company, Avatar, Quote, Rating, Featured | Super Admin, Admin |
| **Blog Posts & Categories**| `/admin/posts` | Title, Slug, Category ID, Author (Team Member), Excerpt, Body, Cover Image, Reading Time, Published At | Super Admin, Admin |
| **Career Openings** | `/admin/careers` | Title, Slug, Department, Location Type (`Remote`/`Hybrid`), Experience Level, Overview, Responsibilities, Requirements, Benefits, `is_open` | Super Admin, Admin |
| **Pricing Plans** | `/admin/pricing` | Name, Slug, Headline, Price, Billing Cycle, Features JSON, Popular flag, CTA Text, Sort Order | Super Admin, Admin |
| **FAQs** | `/admin/faqs` | Question, Answer, Category, Sort Order | Super Admin, Admin |
| **Contact Inquiries** | `/admin/messages` | Name, Email, Company, Budget, Service, Message, IP, Status (`new`/`read`/`replied`/`archived`) | Super Admin, Admin |
| **Subscribers** | `/admin/subscribers` | Email, Status (`active`/`unsubscribed`), Export to CSV | Super Admin, Admin |
| **System Settings** | `/admin/settings` | Site name, contact email, socials, maintenance mode, SEO defaults | Super Admin only |

---

## 6. Implementation Roadmap & Milestones

### Phase 1: Foundation, Database & Authentication
- [ ] Create `roles` migration & seed roles (`super_admin`, `admin`, `user`).
- [ ] Add `role_id` and `status` to `users` table with relationships in `User.php`.
- [ ] Implement `RoleMiddleware` and register alias in bootstrap/app.php.
- [ ] Create user authentication & login controllers/views if not already present.
- [ ] Build User Factory & Seeder with initial default Super Admin and test accounts.

### Phase 2: Design System & Shared Admin Components
- [ ] Create `AdminLayout.tsx` with sidebar navigation, header, and profile menu matching the cutting-edge dark aesthetic.
- [ ] Develop reusable component library in `resources/js/Components/Admin/`:
  - `AdminDataTable` (Search, pagination, filter)
  - `AdminForm` components (Input, Select, Switch, MediaUpload)
  - `AdminModal` & `AdminConfirmDialog`
  - `AdminStatsCard`

### Phase 3: User & Role Management Module (Super Admin)
- [ ] Implement `AdminUserController`:
  - List users with search, role filter, status badge.
  - Create user modal/page (Select role: Super Admin, Admin, User).
  - Edit user and toggle status (Active / Suspended).
  - Delete user with policy safeguard (cannot delete self).

### Phase 4: Content CRUD Modules (Inertia Pages & Controllers)
- [ ] **Projects & Services**: Media upload handling, deliverables tag input, metrics builder.
- [ ] **Team Members & Clients**: Avatar upload, marquee row toggling, sort ordering.
- [ ] **Blog Posts & Categories**: Rich text editing, category selector, author assignment.
- [ ] **Careers & Pricing**: Dynamic feature bullet point editors, status switches.
- [ ] **Inquiries & Subscribers**: Read/reply status update, export options.

### Phase 5: Dashboard Overview & Polish
- [ ] Update `AdminDashboardController` and `Admin/Dashboard.tsx` to surface real-time KPIs, latest inquiries, recent project updates, and quick access action buttons.
- [ ] Run Laravel Pint (`vendor/bin/pint --format agent`) and TypeScript checks (`npm run build`).
- [ ] Write Feature tests (`php artisan make:test --phpunit AdminUserTest`) to verify role authorization and CRUD operations.

---

## 7. Verification & Testing Strategy

1. **Role Access Control Tests:**
   - Unauthenticated users cannot access `/admin/*` and are redirected to login.
   - Standard `user` role gets `403 Forbidden` on `/admin/users` or restricted pages.
   - `admin` role can create/update projects, services, blog posts, but gets `403 Forbidden` on `/admin/users`.
   - `super_admin` has full access to all endpoints.
2. **Data Integrity & File Uploads:**
   - Verify file uploads (project covers, logos, avatars) store properly in `storage/app/public` with valid symlinks.
3. **UI / Responsive Tests:**
   - Test data tables on both desktop and mobile viewports with smooth drawer menus.

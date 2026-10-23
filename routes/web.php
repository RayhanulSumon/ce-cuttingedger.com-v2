<?php

use App\Http\Controllers\Admin\AdminAuthController;
use App\Http\Controllers\Admin\AdminBlogCategoryController;
use App\Http\Controllers\Admin\AdminBlogController;
use App\Http\Controllers\Admin\AdminCareerOpeningController;
use App\Http\Controllers\Admin\AdminChatSessionController;
use App\Http\Controllers\Admin\AdminClientController;
use App\Http\Controllers\Admin\AdminConsultationController;
use App\Http\Controllers\Admin\AdminContactMessageController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminFaqController;
use App\Http\Controllers\Admin\AdminNotificationController;
use App\Http\Controllers\Admin\AdminOrderController;
use App\Http\Controllers\Admin\AdminPricingPlanController;
use App\Http\Controllers\Admin\AdminProjectController;
use App\Http\Controllers\Admin\AdminRedirectController;
use App\Http\Controllers\Admin\AdminServiceController;
use App\Http\Controllers\Admin\AdminSettingController;
use App\Http\Controllers\Admin\AdminSubscriberController;
use App\Http\Controllers\Admin\AdminTeamMemberController;
use App\Http\Controllers\Admin\AdminTestimonialController;
use App\Http\Controllers\Admin\AdminTrackingScriptController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\CareerController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\NewsletterController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\SitemapController;
use App\Http\Controllers\TeamController;
use App\Http\Controllers\WorkController;
use App\Models\Project;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes — Cutting Edger B2B Performance Agency
|--------------------------------------------------------------------------
*/

Route::get('/', [HomeController::class, 'index'])->name('home');

/*
|--------------------------------------------------------------------------
| Admin Authentication Routes
|--------------------------------------------------------------------------
*/
Route::get('/admin/login', [AdminAuthController::class, 'showLogin'])->name('admin.login');
Route::get('/login', fn () => redirect()->route('admin.login'))->name('login');
Route::post('/admin/login', [AdminAuthController::class, 'login'])->name('admin.login.submit');
Route::post('/admin/logout', [AdminAuthController::class, 'logout'])->name('admin.logout');

/*
|--------------------------------------------------------------------------
| Admin Protected Operations Portal
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'role:super_admin,admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [AdminDashboardController::class, 'index'])->name('dashboard');

    // Content & Agency CRUDs
    Route::resource('projects', AdminProjectController::class)->except(['show', 'create', 'edit']);
    Route::resource('services', AdminServiceController::class)->except(['show', 'create', 'edit']);
    Route::resource('team', AdminTeamMemberController::class)->except(['show', 'create', 'edit']);
    Route::resource('clients', AdminClientController::class)->except(['show', 'create', 'edit']);
    Route::resource('testimonials', AdminTestimonialController::class)->except(['show', 'create', 'edit']);
    Route::resource('blog-categories', AdminBlogCategoryController::class)->except(['show', 'create', 'edit']);
    Route::get('blogs/trash', [AdminBlogController::class, 'trash'])->name('blogs.trash');
    Route::post('blogs/{id}/restore', [AdminBlogController::class, 'restore'])->name('blogs.restore');
    Route::delete('blogs/{id}/force-delete', [AdminBlogController::class, 'forceDelete'])->name('blogs.force-delete');
    Route::resource('blogs', AdminBlogController::class)->except(['show', 'create', 'edit']);
    Route::resource('careers', AdminCareerOpeningController::class)->except(['show', 'create', 'edit']);
    Route::resource('pricing', AdminPricingPlanController::class)->except(['show', 'create', 'edit']);
    Route::resource('faqs', AdminFaqController::class)->except(['show', 'create', 'edit']);
    Route::resource('messages', AdminContactMessageController::class)->only(['index', 'update', 'destroy']);
    Route::resource('subscribers', AdminSubscriberController::class)->only(['index', 'destroy']);
    Route::resource('consultations', AdminConsultationController::class)->only(['index', 'update', 'destroy']);
    Route::get('free-trials', fn () => redirect()->route('admin.orders.index', ['type' => 'free_trial']))->name('free-trials.index');
    Route::get('orders/{order}/download-zip', [AdminOrderController::class, 'downloadZip'])->name('orders.download-zip');
    Route::resource('orders', AdminOrderController::class)->only(['index', 'update', 'destroy']);
    Route::delete('chat-sessions-bulk/destroy-all', [AdminChatSessionController::class, 'destroyAll'])->name('chat-sessions.destroy-all');
    Route::post('chat-sessions/mark-all-read', [AdminChatSessionController::class, 'markAllLeadsRead'])->name('chat-sessions.mark-all-read');
    Route::resource('chat-sessions', AdminChatSessionController::class)->only(['index', 'show', 'destroy']);

    // Admin Realtime Notifications Dropdown
    Route::get('notifications', [AdminNotificationController::class, 'index'])->name('notifications.index');
    Route::post('notifications/mark-all-read', [AdminNotificationController::class, 'markAllRead'])->name('notifications.mark-all-read');
    Route::post('notifications/{id}/read', [AdminNotificationController::class, 'markAsRead'])->name('notifications.read');
    Route::delete('notifications/clear-all', [AdminNotificationController::class, 'clearAll'])->name('notifications.clear-all');
    Route::delete('notifications/{id}', [AdminNotificationController::class, 'destroy'])->name('notifications.destroy');

    // SEO: Scripts & Tracking Manager (No Codebase Deployment Needed)
    Route::get('tracking-scripts', [AdminTrackingScriptController::class, 'index'])->name('tracking-scripts.index');
    Route::post('tracking-scripts', [AdminTrackingScriptController::class, 'store'])->name('tracking-scripts.store');
    Route::put('tracking-scripts/{trackingScript}', [AdminTrackingScriptController::class, 'update'])->name('tracking-scripts.update');
    Route::post('tracking-scripts/{trackingScript}/toggle', [AdminTrackingScriptController::class, 'toggle'])->name('tracking-scripts.toggle');
    Route::delete('tracking-scripts/{trackingScript}', [AdminTrackingScriptController::class, 'destroy'])->name('tracking-scripts.destroy');

    // SEO: Redirects & 404 Resolution Manager
    Route::get('redirects', [AdminRedirectController::class, 'index'])->name('redirects.index');
    Route::post('redirects', [AdminRedirectController::class, 'store'])->name('redirects.store');
    Route::put('redirects/{redirect}', [AdminRedirectController::class, 'update'])->name('redirects.update');
    Route::post('redirects/{redirect}/toggle', [AdminRedirectController::class, 'toggle'])->name('redirects.toggle');
    Route::delete('redirects/{redirect}', [AdminRedirectController::class, 'destroy'])->name('redirects.destroy');
    Route::get('redirects-export/csv', [AdminRedirectController::class, 'exportCsv'])->name('redirects.export');
    Route::post('redirects-import/csv', [AdminRedirectController::class, 'importCsv'])->name('redirects.import');
    Route::post('redirects/resolve-404/{notFoundLog}', [AdminRedirectController::class, 'resolve404'])->name('redirects.resolve-404');
    Route::delete('redirects-clear/404s', [AdminRedirectController::class, 'clear404Logs'])->name('redirects.clear-404s');

    // Super Admin Exclusive Endpoints
    Route::middleware('role:super_admin')->group(function () {
        Route::resource('users', AdminUserController::class)->except(['show', 'create', 'edit']);
        Route::post('users/{user}/toggle-status', [AdminUserController::class, 'toggleStatus'])->name('users.toggle-status');
        Route::get('settings', [AdminSettingController::class, 'index'])->name('settings.index');
        Route::post('settings', [AdminSettingController::class, 'update'])->name('settings.update');
    });
});

/*
|--------------------------------------------------------------------------
| Public SEO & Lead Generation Routes
|--------------------------------------------------------------------------
*/

Route::get('/about', [PageController::class, 'about'])->name('about');

// Service Pillars Hub and Hierarchical Child Pages
Route::get('/services', [ServiceController::class, 'index'])->name('services.index');
Route::get('/services/{parentSlug}/{childSlug?}', [ServiceController::class, 'show'])->name('services.show');

// Case Studies (Primary SEO Plan URL) & Legacy /work 301
Route::get('/case-studies', [WorkController::class, 'index'])->name('case-studies.index');
Route::get('/case-studies/{project:slug}', [WorkController::class, 'show'])->name('case-studies.show');
Route::get('/work', fn () => redirect()->to('/case-studies', 301))->name('work.index');
Route::get('/work/{project:slug}', fn (Project $project) => redirect()->to("/case-studies/{$project->slug}", 301))->name('work.show');

// Verified Reviews & Social Proof
Route::get('/reviews', [PageController::class, 'reviews'])->name('reviews');

// Legal, Trust & Security Compliance Pages
Route::get('/cookie-policy', [PageController::class, 'cookiePolicy'])->name('cookie-policy');
Route::get('/nda-compliance', [PageController::class, 'ndaCompliance'])->name('nda-compliance');
Route::get('/ESG-policy', [PageController::class, 'esgPolicy'])->name('esg-policy');
Route::get('/privacy', [PageController::class, 'privacy'])->name('privacy');
Route::get('/terms', [PageController::class, 'terms'])->name('terms');

// Dedicated Conversion Thank-You Page (noindex)
Route::get('/thank-you', [PageController::class, 'thankYou'])->name('thank-you');

// Agency Team & Careers
Route::get('/team', [TeamController::class, 'index'])->name('team.index');
Route::get('/team/{member:slug}', [TeamController::class, 'show'])->name('team.show');
Route::post('/team/{member:slug}/inquiry', [TeamController::class, 'sendInquiry'])
    ->middleware('throttle:team-inquiry')
    ->name('team.inquiry');

Route::get('/careers', [CareerController::class, 'index'])->name('careers.index');
Route::get('/careers/{job:slug}', [CareerController::class, 'show'])->name('careers.show');

Route::get('/pricing', [PageController::class, 'pricing'])->name('pricing');
Route::get('/faq', [PageController::class, 'faq'])->name('faq');

Route::get('/blog', [BlogController::class, 'index'])->name('blog.index');
Route::get('/blog/{blog:slug}', [BlogController::class, 'show'])->name('blog.show');

Route::get('/contact', [ContactController::class, 'index'])->name('contact');
Route::post('/contact', [ContactController::class, 'store'])
    ->middleware('throttle:public-contact')
    ->name('contact.store');

Route::post('/free-trial', [ContactController::class, 'storeFreeTrial'])
    ->middleware('throttle:public-contact')
    ->name('free-trial.store');

Route::post('/newsletter', [NewsletterController::class, 'store'])
    ->middleware('throttle:newsletter')
    ->name('newsletter.store');

Route::get('/sitemap.xml', [SitemapController::class, 'index'])->name('sitemap');
Route::get('/robots.txt', [PageController::class, 'robots'])->name('robots');

/*
|--------------------------------------------------------------------------
| Smart Client Chat Dialog & Hybrid MCP API
|--------------------------------------------------------------------------
*/
Route::prefix('api/chat')->name('chat.')->group(function (): void {
    Route::post('/session', [ChatController::class, 'session'])->name('session');
    Route::post('/reset', [ChatController::class, 'reset'])->name('reset');
    Route::post('/message', [ChatController::class, 'message'])->name('message');
    Route::post('/upload', [ChatController::class, 'uploadImage'])->name('upload');
    Route::post('/lead', [ChatController::class, 'saveLead'])->name('lead');
    Route::post('/cloud-link', [ChatController::class, 'saveCloudLink'])->name('cloud-link');
    Route::post('/book-slot', [ChatController::class, 'bookSlot'])->name('book-slot');
    Route::get('/inactivity-check', [ChatController::class, 'checkInactivity'])->name('inactivity-check');
});

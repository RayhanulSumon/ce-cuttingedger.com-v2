<?php

use App\Http\Controllers\Admin\AdminAuthController;
use App\Http\Controllers\Admin\AdminBlogCategoryController;
use App\Http\Controllers\Admin\AdminBlogController;
use App\Http\Controllers\Admin\AdminCapabilityController;
use App\Http\Controllers\Admin\AdminCareerOpeningController;
use App\Http\Controllers\Admin\AdminChatSessionController;
use App\Http\Controllers\Admin\AdminClientController;
use App\Http\Controllers\Admin\AdminContactMessageController;
use App\Http\Controllers\Admin\AdminCreditPurchaseController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminDigitalTwinController;
use App\Http\Controllers\Admin\AdminFaqController;
use App\Http\Controllers\Admin\AdminNotificationController;
use App\Http\Controllers\Admin\AdminOrderController;
use App\Http\Controllers\Admin\AdminPricingPlanController;
use App\Http\Controllers\Admin\AdminProjectController;
use App\Http\Controllers\Admin\AdminRedirectController;
use App\Http\Controllers\Admin\AdminSettingController;
use App\Http\Controllers\Admin\AdminSubscriberController;
use App\Http\Controllers\Admin\AdminSystemLogController;
use App\Http\Controllers\Admin\AdminTeamMemberController;
use App\Http\Controllers\Admin\AdminTestimonialController;
use App\Http\Controllers\Admin\AdminTrackingScriptController;
use App\Http\Controllers\Admin\AdminTryOnLookController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\AiPreviewController;
use App\Http\Controllers\Auth\ClientAuthController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\CapabilityController;
use App\Http\Controllers\CareerController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\Client\ClientPortalController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\CreditPurchaseController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\NewsletterController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\SitemapController;
use App\Http\Controllers\TeamController;
use App\Http\Controllers\WorkController;
use App\Http\Middleware\EnsureClientAccount;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes — Cutting Edger B2B Performance Agency
|--------------------------------------------------------------------------
*/

Route::get('/', [HomeController::class, 'index'])->name('home');

/*
|--------------------------------------------------------------------------
| Client & Admin Authentication Routes
|--------------------------------------------------------------------------
*/
Route::get('/login', [ClientAuthController::class, 'showLogin'])->name('login');
Route::post('/login', [ClientAuthController::class, 'login'])
    ->middleware('throttle:10,1')
    ->name('login.submit');
Route::get('/register', [ClientAuthController::class, 'showRegister'])->name('register');
Route::post('/register', [ClientAuthController::class, 'register'])
    ->middleware('throttle:10,1')
    ->name('register.submit');
Route::post('/logout', [ClientAuthController::class, 'logout'])->name('logout');

Route::get('/forgot-password', [ClientAuthController::class, 'showForgotPassword'])->name('password.request');
Route::post('/forgot-password', [ClientAuthController::class, 'sendResetLinkEmail'])
    ->middleware('throttle:6,1')
    ->name('password.email');
Route::get('/reset-password/{token}', [ClientAuthController::class, 'showResetPassword'])->name('password.reset');
Route::post('/reset-password', [ClientAuthController::class, 'resetPassword'])
    ->middleware('throttle:6,1')
    ->name('password.store');

Route::get('/auth/google/redirect', [ClientAuthController::class, 'redirectToGoogle'])->name('auth.google.redirect');
Route::get('/auth/google/callback', [ClientAuthController::class, 'handleGoogleCallback'])->name('auth.google.callback');

Route::middleware('auth')->group(function () {
    Route::get('/verify-email', [ClientAuthController::class, 'verifyNotice'])->name('verification.notice');
    Route::get('/verify-email/{id}/{hash}', [ClientAuthController::class, 'verifyEmail'])
        ->middleware(['signed', 'throttle:6,1'])
        ->name('verification.verify');
    Route::post('/email/verification-notification', [ClientAuthController::class, 'resendVerification'])
        ->middleware('throttle:6,1')
        ->name('verification.send');
});

Route::get('/admin/login', [AdminAuthController::class, 'showLogin'])->name('admin.login');
Route::post('/admin/login', [AdminAuthController::class, 'login'])
    ->middleware('throttle:10,1')
    ->name('admin.login.submit');
Route::post('/admin/logout', [AdminAuthController::class, 'logout'])->name('admin.logout');

/*
|--------------------------------------------------------------------------
| Admin Protected Operations Portal
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'role:super_admin,admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [AdminDashboardController::class, 'index'])->name('dashboard');

    // Content & Agency CRUDs
    Route::post('digital-twins/attributes', [AdminDigitalTwinController::class, 'storeAttribute'])->name('digital-twin-attributes.store');
    Route::match(['put', 'post'], 'digital-twins/attributes/{attribute}', [AdminDigitalTwinController::class, 'updateAttribute'])->name('digital-twin-attributes.update');
    Route::delete('digital-twins/attributes/{attribute}', [AdminDigitalTwinController::class, 'destroyAttribute'])->name('digital-twin-attributes.destroy');
    Route::get('digital-twins/{digitalTwin}/download-package', [AdminDigitalTwinController::class, 'downloadPackage'])->name('digital-twins.download-package');
    Route::post('digital-twins/{digitalTwin}/toggle-sold-out', [AdminDigitalTwinController::class, 'toggleSoldOut'])->name('digital-twins.toggle-sold-out');
    Route::post('digital-twins/{digitalTwin}', [AdminDigitalTwinController::class, 'update'])->name('digital-twins.update.post');
    Route::resource('digital-twins', AdminDigitalTwinController::class)->only(['index', 'store', 'update', 'destroy']);

    Route::post('try-on-looks/{tryOnLook}', [AdminTryOnLookController::class, 'update'])->name('try-on-looks.update.post');
    Route::resource('try-on-looks', AdminTryOnLookController::class)->only(['index', 'store', 'update', 'destroy']);

    Route::resource('projects', AdminProjectController::class)->except(['show', 'create', 'edit']);
    Route::resource('capabilities', AdminCapabilityController::class)->except(['show', 'create', 'edit']);
    Route::resource('team', AdminTeamMemberController::class)->except(['show', 'create', 'edit']);
    Route::resource('clients', AdminClientController::class)->except(['show', 'create', 'edit']);
    Route::resource('testimonials', AdminTestimonialController::class)->except(['show', 'create', 'edit']);
    Route::resource('blog-categories', AdminBlogCategoryController::class)->except(['show', 'create', 'edit']);
    Route::get('blogs/trash', [AdminBlogController::class, 'trash'])->name('blogs.trash');
    Route::post('blogs/{id}/restore', [AdminBlogController::class, 'restore'])->name('blogs.restore');
    Route::delete('blogs/{id}/force-delete', [AdminBlogController::class, 'forceDelete'])->name('blogs.force-delete');
    Route::post('blogs/upload-cover', [AdminBlogController::class, 'uploadCover'])->name('blogs.upload-cover');
    Route::resource('blogs', AdminBlogController::class)->except(['show']);
    Route::resource('careers', AdminCareerOpeningController::class)->except(['show', 'create', 'edit']);
    Route::resource('pricing', AdminPricingPlanController::class)->except(['show', 'create', 'edit']);
    Route::resource('faqs', AdminFaqController::class)->except(['show', 'create', 'edit']);
    Route::resource('messages', AdminContactMessageController::class)->only(['index', 'update', 'destroy']);
    Route::resource('subscribers', AdminSubscriberController::class)->only(['index', 'destroy']);
    Route::redirect('free-trials', '/admin/orders?type=free_trial')->name('free-trials.index');
    Route::get('orders/{order}/download-zip', [AdminOrderController::class, 'downloadZip'])->name('orders.download-zip');
    Route::resource('orders', AdminOrderController::class)->only(['index', 'update', 'destroy']);
    Route::get('credit-purchases', [AdminCreditPurchaseController::class, 'index'])->name('credit-purchases.index');
    Route::post('credit-purchases/{creditPurchase}/approve', [AdminCreditPurchaseController::class, 'approve'])->name('credit-purchases.approve');
    Route::put('credit-purchases/{creditPurchase}', [AdminCreditPurchaseController::class, 'update'])->name('credit-purchases.update');
    Route::delete('credit-purchases/{creditPurchase}', [AdminCreditPurchaseController::class, 'destroy'])->name('credit-purchases.destroy');
    Route::delete('chat-sessions-bulk/destroy-all', [AdminChatSessionController::class, 'destroyAll'])->name('chat-sessions.destroy-all');
    Route::post('chat-sessions/mark-all-read', [AdminChatSessionController::class, 'markAllLeadsRead'])->name('chat-sessions.mark-all-read');
    Route::post('chat-sessions/{chatSession}/takeover', [AdminChatSessionController::class, 'takeover'])->name('chat-sessions.takeover');
    Route::post('chat-sessions/{chatSession}/release', [AdminChatSessionController::class, 'release'])->name('chat-sessions.release');
    Route::post('chat-sessions/{chatSession}/reply', [AdminChatSessionController::class, 'reply'])->name('chat-sessions.reply');
    Route::get('chat-sessions/{chatSession}/poll', [AdminChatSessionController::class, 'poll'])->name('chat-sessions.poll');
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

    // Registered Client Accounts Management (Separate Page & Link: /admin/client-accounts)
    Route::get('client-accounts', [AdminUserController::class, 'clientAccounts'])->name('client-accounts.index');
    Route::post('client-accounts', [AdminUserController::class, 'store'])->name('client-accounts.store');
    Route::put('client-accounts/{user}', [AdminUserController::class, 'update'])->name('client-accounts.update');
    Route::post('client-accounts/{user}/toggle-status', [AdminUserController::class, 'toggleStatus'])->name('client-accounts.toggle-status');
    Route::post('client-accounts/{user}/verify-email', [AdminUserController::class, 'verifyEmail'])->name('client-accounts.verify-email');
    Route::delete('client-accounts/{user}', [AdminUserController::class, 'destroy'])->name('client-accounts.destroy');

    // Super Admin Exclusive Endpoints (Admin Users, Roles & Permissions, System Settings)
    Route::middleware('role:super_admin')->group(function () {
        Route::resource('users', AdminUserController::class)->except(['show', 'create', 'edit']);
        Route::post('users/{user}/toggle-status', [AdminUserController::class, 'toggleStatus'])->name('users.toggle-status');
        Route::post('roles', [AdminUserController::class, 'storeRole'])->name('roles.store');
        Route::put('roles/{role}', [AdminUserController::class, 'updateRole'])->name('roles.update');
        Route::delete('roles/{role}', [AdminUserController::class, 'destroyRole'])->name('roles.destroy');
        Route::get('settings', [AdminSettingController::class, 'index'])->name('settings.index');
        Route::post('settings', [AdminSettingController::class, 'update'])->name('settings.update');

        // System Logs: Laravel log viewer & error monitor
        Route::get('system-logs', [AdminSystemLogController::class, 'index'])->name('system-logs.index');
        Route::get('system-logs/download', [AdminSystemLogController::class, 'download'])->name('system-logs.download');
        Route::delete('system-logs', [AdminSystemLogController::class, 'clear'])->name('system-logs.clear');
    });
});

/*
|--------------------------------------------------------------------------
| Public SEO & Lead Generation Routes
|--------------------------------------------------------------------------
*/

Route::get('/about', [PageController::class, 'about'])->name('about');

// Capabilities: main capabilities (2D, 3D, DTP, Video) and their sub-capabilities
Route::get('/capabilities', [CapabilityController::class, 'index'])->name('capabilities.index');
Route::get('/capabilities/{parentSlug}/{childSlug?}', [CapabilityController::class, 'show'])->name('capabilities.show');

// Case Studies (Primary SEO Plan URL) & Legacy /work 301
Route::get('/case-studies', [WorkController::class, 'index'])->name('case-studies.index');
Route::get('/case-studies/{project:slug}', [WorkController::class, 'show'])->name('case-studies.show');
Route::permanentRedirect('/work', '/case-studies')->name('work.index');
Route::get('/work/{project:slug}', [WorkController::class, 'redirectLegacy'])->name('work.show');

// The reviews and FAQ pages now live on the homepage.
Route::permanentRedirect('/reviews', '/?section=clients');
Route::permanentRedirect('/faq', '/?section=faq');

// Legal, Trust & Security Compliance Pages
Route::get('/cookie-policy', [PageController::class, 'cookiePolicy'])->name('cookie-policy');
Route::get('/nda-compliance', [PageController::class, 'ndaCompliance'])->name('nda-compliance');
Route::get('/esg-policy', [PageController::class, 'esgPolicy'])->name('esg-policy');
Route::permanentRedirect('/ESG-policy', '/esg-policy');
Route::get('/privacy', [PageController::class, 'privacy'])->name('privacy');
Route::get('/terms', [PageController::class, 'terms'])->name('terms');

// Dedicated Conversion Thank-You Page (noindex)
Route::get('/thank-you', [PageController::class, 'thankYou'])->name('thank-you');

// Digital Twins & Virtual Try-On Order Views
Route::permanentRedirect('/digital-twins', '/capabilities/2d/digital-twins')->name('digital-twins.index');
Route::get('/digital-twins/order', [OrderController::class, 'digitalTwinOrder'])->name('digital-twins.order');
Route::get('/virtual-try-on/order', [OrderController::class, 'tryOnOrder'])->name('try-on.order');
Route::get('/order', [OrderController::class, 'legacyRedirect'])->name('order');

// Real-Time AI Preview (Max 2 Free per Account / IP)
Route::get('/ai-preview/quota', [AiPreviewController::class, 'quota'])->name('ai-preview.quota');
Route::post('/ai-preview/generate', [AiPreviewController::class, 'generate'])
    ->middleware('throttle:public-contact')
    ->name('ai-preview.generate');

// Protected Client Portal & Order Submission Routes (Requires Verified Client Account)
Route::middleware(['auth', 'verified', EnsureClientAccount::class])->group(function () {
    Route::get('/portal', [ClientPortalController::class, 'index'])->name('client.portal');
    Route::get('/portal/orders', [ClientPortalController::class, 'orders'])->name('client.portal.orders');
    Route::get('/portal/orders/{order}/download-twin-package', [ClientPortalController::class, 'downloadDigitalTwinPackage'])->name('client.portal.orders.download-twin');
    Route::get('/portal/credits', [ClientPortalController::class, 'credits'])->name('client.portal.credits');
    Route::get('/portal/settings', [ClientPortalController::class, 'settings'])->name('client.portal.settings');
    Route::redirect('/dashboard', '/portal')->name('dashboard');
    Route::post('/portal/profile', [ClientPortalController::class, 'updateProfile'])->name('client.portal.profile');
    Route::post('/portal/avatar', [ClientPortalController::class, 'updateAvatar'])->name('client.portal.avatar');
    Route::delete('/portal/avatar', [ClientPortalController::class, 'destroyAvatar'])->name('client.portal.avatar.destroy');
    Route::post('/portal/password', [ClientPortalController::class, 'updatePassword'])->name('client.portal.password');

    Route::post('/digital-twins/order', [OrderController::class, 'storeDigitalTwinOrder'])
        ->middleware('throttle:public-contact')
        ->name('digital-twins.order.store');

    Route::post('/virtual-try-on/order', [OrderController::class, 'storeTryOnOrder'])
        ->middleware('throttle:public-contact')
        ->name('try-on.order.store');

    Route::post('/pricing/buy-plan', [CreditPurchaseController::class, 'store'])
        ->middleware('throttle:public-contact')
        ->name('pricing.buy-plan');

    Route::post('/portal/use-credits', [OrderController::class, 'storeCreditUsageOrder'])
        ->middleware('throttle:public-contact')
        ->name('portal.use-credits');
});

// Agency Team & Careers
Route::get('/team', [TeamController::class, 'index'])->name('team.index');
Route::get('/team/{member:slug}', [TeamController::class, 'show'])->name('team.show');
Route::post('/team/{member:slug}/inquiry', [TeamController::class, 'sendInquiry'])
    ->middleware('throttle:team-inquiry')
    ->name('team.inquiry');

Route::get('/careers', [CareerController::class, 'index'])->name('careers.index');
Route::permanentRedirect('/career', '/careers')->name('career');
Route::get('/careers/{job:slug}', [CareerController::class, 'show'])->name('careers.show');

Route::get('/pricing', [PageController::class, 'pricing'])->name('pricing');

Route::get('/blog', [BlogController::class, 'index'])->name('blog.index');
Route::get('/blog/{blog:slug}', [BlogController::class, 'show'])->name('blog.show');

Route::get('/book-a-demo', [PageController::class, 'bookDemo'])->name('book-demo');

Route::get('/contact', [ContactController::class, 'index'])->name('contact');
Route::post('/contact', [ContactController::class, 'store'])
    ->middleware('throttle:public-contact')
    ->name('contact.store');

Route::post('/newsletter', [NewsletterController::class, 'store'])
    ->middleware('throttle:newsletter')
    ->name('newsletter.store');

Route::get('/sitemap.xml', [SitemapController::class, 'index'])->name('sitemap');
Route::get('/robots.txt', [PageController::class, 'robots'])->name('robots');

/*
|--------------------------------------------------------------------------
| Fast Cached Catalog APIs
|--------------------------------------------------------------------------
*/
Route::prefix('api/catalog')->name('api.catalog.')->group(function (): void {
    Route::get('/capabilities', [CapabilityController::class, 'apiIndex'])->name('capabilities');
    Route::get('/digital-twins', [OrderController::class, 'apiDigitalTwins'])->name('digital-twins');
    Route::get('/try-on-looks', [OrderController::class, 'apiTryOnLooks'])->name('try-on-looks');
});

/*
|--------------------------------------------------------------------------
| Information-only Chat Assistant
|--------------------------------------------------------------------------
*/
Route::prefix('api/chat')->name('chat.')->group(function (): void {
    Route::post('/session', [ChatController::class, 'session'])->name('session');
    Route::post('/reset', [ChatController::class, 'reset'])->name('reset');
    Route::post('/message', [ChatController::class, 'message'])
        ->middleware('throttle:40,1')
        ->name('message');
    Route::get('/poll', [ChatController::class, 'poll'])->name('poll');
});

Route::get('/api/captcha/math', [ContactController::class, 'mathCaptcha'])->name('captcha.math');

/*
|--------------------------------------------------------------------------
| Dynamic Fallback Router: 301 Redirect Engine & 404 Intelligence
|--------------------------------------------------------------------------
*/
Route::fallback([PageController::class, 'notFound']);

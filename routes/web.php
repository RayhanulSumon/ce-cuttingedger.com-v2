<?php

use App\Http\Controllers\Admin\AdminAuthController;
use App\Http\Controllers\Admin\AdminBlogCategoryController;
use App\Http\Controllers\Admin\AdminBlogController;
use App\Http\Controllers\Admin\AdminCapabilityController;
use App\Http\Controllers\Admin\AdminCareerOpeningController;
use App\Http\Controllers\Admin\AdminChatSessionController;
use App\Http\Controllers\Admin\AdminClientController;
use App\Http\Controllers\Admin\AdminConsultationController;
use App\Http\Controllers\Admin\AdminContactMessageController;
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
use App\Http\Controllers\Admin\AdminTeamMemberController;
use App\Http\Controllers\Admin\AdminTestimonialController;
use App\Http\Controllers\Admin\AdminTrackingScriptController;
use App\Http\Controllers\Admin\AdminTryOnLookController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\CapabilityController;
use App\Http\Controllers\CareerController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\DiscoveryCallController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\NewsletterController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\SitemapController;
use App\Http\Controllers\TeamController;
use App\Http\Controllers\WorkController;
use App\Models\Project;
use App\Services\Security\EmailAndSpamGuard;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

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
    Route::post('digital-twins/attributes', [AdminDigitalTwinController::class, 'storeAttribute'])->name('digital-twin-attributes.store');
    Route::match(['put', 'post'], 'digital-twins/attributes/{attribute}', [AdminDigitalTwinController::class, 'updateAttribute'])->name('digital-twin-attributes.update');
    Route::delete('digital-twins/attributes/{attribute}', [AdminDigitalTwinController::class, 'destroyAttribute'])->name('digital-twin-attributes.destroy');
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
    Route::resource('consultations', AdminConsultationController::class)->only(['index', 'update', 'destroy']);
    Route::get('free-trials', fn () => redirect()->route('admin.orders.index', ['type' => 'free_trial']))->name('free-trials.index');
    Route::get('orders/{order}/download-zip', [AdminOrderController::class, 'downloadZip'])->name('orders.download-zip');
    Route::resource('orders', AdminOrderController::class)->only(['index', 'update', 'destroy']);
    Route::delete('chat-sessions-bulk/destroy-all', [AdminChatSessionController::class, 'destroyAll'])->name('chat-sessions.destroy-all');
    Route::post('chat-sessions/mark-all-read', [AdminChatSessionController::class, 'markAllLeadsRead'])->name('chat-sessions.mark-all-read');
    Route::post('chat-sessions/{chatSession}/takeover', [AdminChatSessionController::class, 'takeover'])->name('chat-sessions.takeover');
    Route::post('chat-sessions/{chatSession}/release', [AdminChatSessionController::class, 'release'])->name('chat-sessions.release');
    Route::post('chat-sessions/{chatSession}/reply', [AdminChatSessionController::class, 'reply'])->name('chat-sessions.reply');
    Route::get('chat-sessions/{chatSession}/poll', [AdminChatSessionController::class, 'poll'])->name('chat-sessions.poll');
    Route::get('chat sessions', fn () => redirect('/admin/chat-sessions'));
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

// Capabilities: main capabilities (2D, 3D, DTP, Video) and their sub-capabilities
Route::get('/capabilities', [CapabilityController::class, 'index'])->name('capabilities.index');
Route::get('/capabilities/{parentSlug}/{childSlug?}', [CapabilityController::class, 'show'])->name('capabilities.show');

// Case Studies (Primary SEO Plan URL) & Legacy /work 301
Route::get('/case-studies', [WorkController::class, 'index'])->name('case-studies.index');
Route::get('/case-studies/{project:slug}', [WorkController::class, 'show'])->name('case-studies.show');
Route::get('/work', fn () => redirect()->to('/case-studies', 301))->name('work.index');
Route::get('/work/{project:slug}', fn (Project $project) => redirect()->to("/case-studies/{$project->slug}", 301))->name('work.show');

// The reviews and FAQ pages now live on the homepage.
Route::get('/reviews', fn () => redirect()->to('/?section=clients', 301));
Route::get('/faq', fn () => redirect()->to('/?section=faq', 301));

// Legal, Trust & Security Compliance Pages
Route::get('/cookie-policy', [PageController::class, 'cookiePolicy'])->name('cookie-policy');
Route::get('/nda-compliance', [PageController::class, 'ndaCompliance'])->name('nda-compliance');
Route::get('/esg-policy', [PageController::class, 'esgPolicy'])->name('esg-policy');
Route::get('/ESG-policy', fn () => redirect()->to('/esg-policy', 301));
Route::get('/privacy', [PageController::class, 'privacy'])->name('privacy');
Route::get('/terms', [PageController::class, 'terms'])->name('terms');

// Dedicated Conversion Thank-You Page (noindex)
Route::get('/thank-you', [PageController::class, 'thankYou'])->name('thank-you');

// Digital Twins Catalogue, Dedicated Custom Twin Order & Virtual Try-On Quote Pages
Route::get('/digital-twins', [PageController::class, 'digitalTwins'])->name('digital-twins.index');
Route::get('/digital-twins/order', [OrderController::class, 'digitalTwinOrder'])->name('digital-twins.order');
Route::post('/digital-twins/order', [OrderController::class, 'storeDigitalTwinOrder'])
    ->middleware('throttle:public-contact')
    ->name('digital-twins.order.store');

Route::get('/virtual-try-on/quote', [OrderController::class, 'tryOnQuote'])->name('try-on.quote');
Route::post('/virtual-try-on/quote', [OrderController::class, 'storeTryOnQuote'])
    ->middleware('throttle:public-contact')
    ->name('try-on.quote.store');

Route::get('/order', [OrderController::class, 'legacyRedirect'])->name('order');

// Agency Team & Careers
Route::get('/team', [TeamController::class, 'index'])->name('team.index');
Route::get('/team/{member:slug}', [TeamController::class, 'show'])->name('team.show');
Route::post('/team/{member:slug}/inquiry', [TeamController::class, 'sendInquiry'])
    ->middleware('throttle:team-inquiry')
    ->name('team.inquiry');

Route::get('/careers', [CareerController::class, 'index'])->name('careers.index');
Route::get('/career', fn () => redirect()->to('/careers', 301))->name('career');
Route::get('/careers/{job:slug}', [CareerController::class, 'show'])->name('careers.show');

Route::get('/pricing', [PageController::class, 'pricing'])->name('pricing');

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
| Fast Cached Catalog APIs
|--------------------------------------------------------------------------
*/
Route::prefix('api/catalog')->name('api.catalog.')->group(function (): void {
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
    Route::post('/message', [ChatController::class, 'message'])->name('message');
    Route::get('/poll', [ChatController::class, 'poll'])->name('poll');
});

Route::get('/api/discovery-call/slots', [DiscoveryCallController::class, 'slots'])->name('discovery-call.slots');
Route::post('/api/discovery-call/book', [DiscoveryCallController::class, 'book'])->name('discovery-call.book');

Route::get('/api/captcha/math', function (EmailAndSpamGuard $guard) {
    return response()->json($guard->generateMathCaptcha());
})->name('captcha.math');

/*
|--------------------------------------------------------------------------
| Dynamic Fallback Router: 301 Redirect Engine & 404 Intelligence
|--------------------------------------------------------------------------
*/
Route::fallback(function (Request $request) {
    return Inertia::render('Errors/404')
        ->toResponse($request)
        ->setStatusCode(404);
});

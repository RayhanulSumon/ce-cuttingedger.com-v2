<?php

use App\Http\Controllers\Admin\AdminDashboardController;
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
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

Route::get('/', [HomeController::class, 'index'])->name('home');

use App\Http\Controllers\Admin\AdminAuthController;
use App\Http\Controllers\Admin\AdminBlogCategoryController;
use App\Http\Controllers\Admin\AdminBlogController;
use App\Http\Controllers\Admin\AdminCareerOpeningController;
use App\Http\Controllers\Admin\AdminChatSessionController;
use App\Http\Controllers\Admin\AdminClientController;
use App\Http\Controllers\Admin\AdminConsultationController;
use App\Http\Controllers\Admin\AdminContactMessageController;
use App\Http\Controllers\Admin\AdminFaqController;
use App\Http\Controllers\Admin\AdminNotificationController;
use App\Http\Controllers\Admin\AdminOrderController;
use App\Http\Controllers\Admin\AdminPricingPlanController;
use App\Http\Controllers\Admin\AdminProjectController;
use App\Http\Controllers\Admin\AdminServiceController;
use App\Http\Controllers\Admin\AdminSettingController;
use App\Http\Controllers\Admin\AdminSubscriberController;
use App\Http\Controllers\Admin\AdminTeamMemberController;
use App\Http\Controllers\Admin\AdminTestimonialController;
use App\Http\Controllers\Admin\AdminUserController;

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

    // Super Admin Exclusive Endpoints
    Route::middleware('role:super_admin')->group(function () {
        Route::resource('users', AdminUserController::class)->except(['show', 'create', 'edit']);
        Route::post('users/{user}/toggle-status', [AdminUserController::class, 'toggleStatus'])->name('users.toggle-status');
        Route::get('settings', [AdminSettingController::class, 'index'])->name('settings.index');
        Route::post('settings', [AdminSettingController::class, 'update'])->name('settings.update');
    });
});

Route::get('/about', [PageController::class, 'about'])->name('about');

Route::get('/services', [ServiceController::class, 'index'])->name('services.index');
Route::get('/services/{service:slug}', [ServiceController::class, 'show'])->name('services.show');

Route::get('/work', [WorkController::class, 'index'])->name('work.index');
Route::get('/work/{project:slug}', [WorkController::class, 'show'])->name('work.show');

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

Route::get('/privacy', [PageController::class, 'privacy'])->name('privacy');
Route::get('/terms', [PageController::class, 'terms'])->name('terms');

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

/*
|--------------------------------------------------------------------------
| Legacy 301 Permanent Redirects (Preserves Google Search Authority & Traffic)
|--------------------------------------------------------------------------
*/
$legacyRedirects = [
    // 2D Image Editing services
    '/photo-background-removal-services' => '/services/background-removal',
    '/best-clipping-path-service' => '/services/background-removal',
    '/invisible-mannequin' => '/services/ghost-mannequin',
    '/photo-hollow-man-services' => '/services/ghost-mannequin',
    '/photo-jewelry-retouch-services' => '/services/jewelry-retouch',
    '/photo-high-end-model-retouch-services' => '/services/high-end-model-retouch',
    '/photo-retouching-outsourcing' => '/services/high-end-model-retouch',
    '/photo-lifestyle-retouch-services' => '/services/high-end-model-retouch',
    '/photo-semi-nude-or-calendar-model-retouch-services' => '/services/high-end-model-retouch',
    '/photo-lingerie-model-retouch-services' => '/services/high-end-model-retouch',
    '/photo-automobile-retouch-services' => '/services/background-removal',
    '/photo-accessories-retouch-services' => '/services/jewelry-retouch',
    '/photo-shoe-retouch-services' => '/services/high-end-model-retouch',
    '/image-masking-service' => '/services/background-removal',
    '/shadow-creation-service' => '/services/jewelry-retouch',
    '/photo-reflection-creation-services' => '/services/jewelry-retouch',
    '/photo-color-correction-services' => '/services/background-removal',
    '/photo-manipulation-services' => '/services/high-end-model-retouch',
    '/photo-harmonization-services' => '/services/background-removal',
    '/photo-image-restoration-services' => '/services/high-end-model-retouch',
    '/photo-face-swapping-services' => '/services/high-end-model-retouch',

    // 3D & CGI services
    '/3D/3d-modeling-and-rendering-service' => '/services/3d-modeling-and-rendering',
    '/3d/3d-modeling-and-rendering-service' => '/services/3d-modeling-and-rendering',

    // DTP services
    '/multilingual-typesetting-and-formatting-services' => '/services/desktop-publishing',
    '/brand-identity-services' => '/services/desktop-publishing',
    '/ai-concept-art-and-illustration-services' => '/services/3d-modeling-and-rendering',
    '/presentation-services' => '/services/desktop-publishing',
    '/adaption-services' => '/services/desktop-publishing',
    '/data-entry-services' => '/services/desktop-publishing',

    // Orders & Legacy Pages
    '/option/free-trial' => '/#trial-uploader-section',
    '/option/order' => '/pricing',
    '/page/aboutus' => '/about',
    '/page/contact' => '/contact',
    '/page/pricing' => '/pricing',
    '/page/faqs' => '/faq',
];

foreach ($legacyRedirects as $oldUri => $targetUri) {
    Route::redirect($oldUri, $targetUri, 301);
}

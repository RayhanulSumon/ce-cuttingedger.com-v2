<?php

use App\Http\Controllers\BlogController;
use App\Http\Controllers\CareerController;
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

Route::get('/about', [PageController::class, 'about'])->name('about');

Route::get('/services', [ServiceController::class, 'index'])->name('services.index');
Route::get('/services/{service:slug}', [ServiceController::class, 'show'])->name('services.show');

Route::get('/work', [WorkController::class, 'index'])->name('work.index');
Route::get('/work/{project:slug}', [WorkController::class, 'show'])->name('work.show');

Route::get('/team', [TeamController::class, 'index'])->name('team.index');
Route::get('/team/{member:slug}', [TeamController::class, 'show'])->name('team.show');

Route::get('/careers', [CareerController::class, 'index'])->name('careers.index');
Route::get('/careers/{job:slug}', [CareerController::class, 'show'])->name('careers.show');

Route::get('/pricing', [PageController::class, 'pricing'])->name('pricing');
Route::get('/faq', [PageController::class, 'faq'])->name('faq');

Route::get('/blog', [BlogController::class, 'index'])->name('blog.index');
Route::get('/blog/{post:slug}', [BlogController::class, 'show'])->name('blog.show');

Route::get('/contact', [ContactController::class, 'index'])->name('contact');
Route::post('/contact', [ContactController::class, 'store'])
    ->middleware('throttle:6,1')
    ->name('contact.store');

Route::post('/newsletter', [NewsletterController::class, 'store'])
    ->middleware('throttle:6,1')
    ->name('newsletter.store');

Route::get('/privacy', [PageController::class, 'privacy'])->name('privacy');
Route::get('/terms', [PageController::class, 'terms'])->name('terms');

Route::get('/sitemap.xml', [SitemapController::class, 'index'])->name('sitemap');
Route::get('/robots.txt', [PageController::class, 'robots'])->name('robots');

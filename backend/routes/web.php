<?php

use App\Http\Controllers\Admin\Api\AuthController as ApiAuthController;
use App\Http\Controllers\Admin\Api\CmsAvisController as ApiCmsAvisController;
use App\Http\Controllers\Admin\Api\CmsEventController as ApiCmsEventController;
use App\Http\Controllers\Admin\Api\CmsGalleryItemController as ApiCmsGalleryItemController;
use App\Http\Controllers\Admin\Api\CmsHeroSlideController as ApiCmsHeroSlideController;
use App\Http\Controllers\Admin\Api\CmsMediaController as ApiCmsMediaController;
use App\Http\Controllers\Admin\Api\CmsNavItemController as ApiCmsNavItemController;
use App\Http\Controllers\Admin\Api\CmsPageController as ApiCmsPageController;
use App\Http\Controllers\Admin\Api\ContactController as ApiContactController;
use App\Http\Controllers\Admin\Api\DashboardController as ApiDashboardController;
use App\Http\Controllers\Admin\Api\RegistrationController as ApiRegistrationController;
use App\Http\Controllers\Admin\Api\SettingsController as ApiSettingsController;
use App\Http\Controllers\Admin\Api\SiteSectionController as ApiSiteSectionController;
use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\CmsEventController;
use App\Http\Controllers\Admin\CmsGalleryItemController;
use App\Http\Controllers\Admin\CmsHeroSlideController;
use App\Http\Controllers\Admin\CmsMediaController;
use App\Http\Controllers\Admin\CmsNavItemController;
use App\Http\Controllers\Admin\CmsPageController;
use App\Http\Controllers\Admin\ContactController as AdminContactController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\RegistrationController as AdminRegistrationController;
use App\Http\Controllers\Admin\SiteSectionController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'message' => 'CQPM Nador API',
        'docs' => '/api/health',
        'admin' => '/admin-panel/',
    ]);
});

Route::redirect('/admin-panel', '/admin-panel/');

Route::get('/admin-panel/{path?}', function (?string $path = null) {
    $index = public_path('admin-panel/admin.html');
    if (! file_exists($index)) {
        $index = public_path('admin-panel/index.html');
    }

    if (! file_exists($index)) {
        if (app()->environment('local')) {
            return redirect(rtrim(env('FRONTEND_URL', 'http://127.0.0.1:5173'), '/').'/admin-panel');
        }

        abort(404, 'Admin panel not built. Run: npm run build:admin');
    }

    if ($path && str_contains($path, '.')) {
        abort(404);
    }

    return response()
        ->file($index, ['Content-Type' => 'text/html; charset=UTF-8'])
        ->header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        ->header('Pragma', 'no-cache')
        ->header('Expires', '0');
})->where('path', '.*');

Route::get('/sanctum/csrf-cookie', function () {
    return response()->noContent();
});

Route::redirect('/admin/login', '/admin-panel/');
Route::redirect('/admin', '/admin-panel/');

function registerAdminApiRoutes(): void {
    Route::post('login', [ApiAuthController::class, 'login']);

    Route::middleware('auth')->group(function () {
        Route::post('logout', [ApiAuthController::class, 'logout'])->name('logout');
        Route::get('user', [ApiAuthController::class, 'user']);

        Route::get('/', [ApiDashboardController::class, 'index']);
        Route::get('dashboard', [ApiDashboardController::class, 'index']);
        Route::get('stats', [ApiDashboardController::class, 'index']);
        Route::get('notifications', [ApiDashboardController::class, 'notifications']);
        Route::get('notifications/unread-count', [ApiDashboardController::class, 'unreadCount']);

        Route::get('contacts/export', [ApiContactController::class, 'export']);
        Route::post('contacts/bulk-read', [ApiContactController::class, 'bulkMarkRead']);
        Route::post('contacts/bulk-mark-read', [ApiContactController::class, 'bulkMarkRead']);
        Route::post('contacts/bulk-delete', [ApiContactController::class, 'bulkDestroy']);
        Route::post('contacts/bulk-destroy', [ApiContactController::class, 'bulkDestroy']);
        Route::post('contacts/{contact}/read', [ApiContactController::class, 'markRead']);
        Route::post('contacts/{contact}/mark-read', [ApiContactController::class, 'markRead']);
        Route::get('contacts', [ApiContactController::class, 'index']);
        Route::get('contacts/{contact}', [ApiContactController::class, 'show']);
        Route::delete('contacts/{contact}', [ApiContactController::class, 'destroy']);

        Route::get('registrations/export', [ApiRegistrationController::class, 'export']);
        Route::post('registrations/{registration}/read', [ApiRegistrationController::class, 'markRead']);
        Route::post('registrations/{registration}/mark-read', [ApiRegistrationController::class, 'markRead']);
        Route::get('registrations', [ApiRegistrationController::class, 'index']);
        Route::get('registrations/{registration}', [ApiRegistrationController::class, 'show']);
        Route::delete('registrations/{registration}', [ApiRegistrationController::class, 'destroy']);

        Route::get('settings', [ApiSettingsController::class, 'index']);
        Route::post('settings', [ApiSettingsController::class, 'store']);
        Route::post('settings/logo', [ApiSettingsController::class, 'uploadLogo']);
        Route::post('settings/favicon', [ApiSettingsController::class, 'uploadFavicon']);

        Route::get('sections', [ApiSiteSectionController::class, 'index']);
        Route::get('sections/{key}', [ApiSiteSectionController::class, 'show']);
        Route::put('sections/{key}', [ApiSiteSectionController::class, 'update']);
        Route::post('sections/{key}', [ApiSiteSectionController::class, 'update']);

        Route::get('slides', [ApiCmsHeroSlideController::class, 'index']);
        Route::post('slides', [ApiCmsHeroSlideController::class, 'store']);
        Route::post('slides/reorder', [ApiCmsHeroSlideController::class, 'reorder']);
        Route::get('slides/{slide}', [ApiCmsHeroSlideController::class, 'show']);
        Route::put('slides/{slide}', [ApiCmsHeroSlideController::class, 'update']);
        Route::post('slides/{slide}', [ApiCmsHeroSlideController::class, 'update']);
        Route::delete('slides/{slide}', [ApiCmsHeroSlideController::class, 'destroy']);

        Route::get('media', [ApiCmsMediaController::class, 'index']);
        Route::post('media', [ApiCmsMediaController::class, 'store']);
        Route::delete('media/{medium}', [ApiCmsMediaController::class, 'destroy']);

        Route::get('events', [ApiCmsEventController::class, 'index']);
        Route::post('events', [ApiCmsEventController::class, 'store']);
        Route::get('events/{event}', [ApiCmsEventController::class, 'show']);
        Route::put('events/{event}', [ApiCmsEventController::class, 'update']);
        Route::post('events/{event}', [ApiCmsEventController::class, 'update']);
        Route::delete('events/{event}', [ApiCmsEventController::class, 'destroy']);

        Route::get('avis', [ApiCmsAvisController::class, 'index']);
        Route::post('avis', [ApiCmsAvisController::class, 'store']);
        Route::get('avis/{avis}', [ApiCmsAvisController::class, 'show']);
        Route::put('avis/{avis}', [ApiCmsAvisController::class, 'update']);
        Route::post('avis/{avis}', [ApiCmsAvisController::class, 'update']);
        Route::delete('avis/{avis}', [ApiCmsAvisController::class, 'destroy']);

        Route::get('gallery', [ApiCmsGalleryItemController::class, 'index']);
        Route::post('gallery', [ApiCmsGalleryItemController::class, 'store']);
        Route::get('gallery/{gallery}', [ApiCmsGalleryItemController::class, 'show']);
        Route::put('gallery/{gallery}', [ApiCmsGalleryItemController::class, 'update']);
        Route::post('gallery/{gallery}', [ApiCmsGalleryItemController::class, 'update']);
        Route::delete('gallery/{gallery}', [ApiCmsGalleryItemController::class, 'destroy']);

        Route::prefix('cms')->name('cms.')->group(function () {
            Route::get('pages', [ApiCmsPageController::class, 'index']);
            Route::post('pages', [ApiCmsPageController::class, 'store']);
            Route::get('pages/{page}', [ApiCmsPageController::class, 'show']);
            Route::put('pages/{page}', [ApiCmsPageController::class, 'update']);
            Route::delete('pages/{page}', [ApiCmsPageController::class, 'destroy']);

            Route::get('slides', [ApiCmsHeroSlideController::class, 'index']);
            Route::post('slides', [ApiCmsHeroSlideController::class, 'store']);
            Route::post('slides/reorder', [ApiCmsHeroSlideController::class, 'reorder']);
            Route::get('slides/{slide}', [ApiCmsHeroSlideController::class, 'show']);
            Route::put('slides/{slide}', [ApiCmsHeroSlideController::class, 'update']);
            Route::post('slides/{slide}', [ApiCmsHeroSlideController::class, 'update']);
            Route::delete('slides/{slide}', [ApiCmsHeroSlideController::class, 'destroy']);

            Route::get('nav', [ApiCmsNavItemController::class, 'index']);
            Route::post('nav', [ApiCmsNavItemController::class, 'store']);
            Route::post('nav/reorder', [ApiCmsNavItemController::class, 'reorder']);
            Route::get('nav/{nav}', [ApiCmsNavItemController::class, 'show']);
            Route::put('nav/{nav}', [ApiCmsNavItemController::class, 'update']);
            Route::delete('nav/{nav}', [ApiCmsNavItemController::class, 'destroy']);

            Route::get('media', [ApiCmsMediaController::class, 'index']);
            Route::post('media', [ApiCmsMediaController::class, 'store']);
            Route::delete('media/{medium}', [ApiCmsMediaController::class, 'destroy']);

            Route::get('events', [ApiCmsEventController::class, 'index']);
            Route::post('events', [ApiCmsEventController::class, 'store']);
            Route::get('events/{event}', [ApiCmsEventController::class, 'show']);
            Route::put('events/{event}', [ApiCmsEventController::class, 'update']);
            Route::post('events/{event}', [ApiCmsEventController::class, 'update']);
            Route::delete('events/{event}', [ApiCmsEventController::class, 'destroy']);

            Route::get('avis', [ApiCmsAvisController::class, 'index']);
            Route::post('avis', [ApiCmsAvisController::class, 'store']);
            Route::get('avis/{avis}', [ApiCmsAvisController::class, 'show']);
            Route::put('avis/{avis}', [ApiCmsAvisController::class, 'update']);
            Route::post('avis/{avis}', [ApiCmsAvisController::class, 'update']);
            Route::delete('avis/{avis}', [ApiCmsAvisController::class, 'destroy']);
        });
    });
}

Route::prefix('api/admin')->name('api.admin.')->group(function () {
    registerAdminApiRoutes();
});

Route::prefix('admin')->name('admin.')->group(function () {
    registerAdminApiRoutes();

    Route::middleware('auth')->group(function () {
        Route::get('blade', [DashboardController::class, 'index'])->name('dashboard');
        Route::get('blade/contacts', [AdminContactController::class, 'index'])->name('contacts.index');
        Route::get('blade/contacts/{contact}', [AdminContactController::class, 'show'])->name('contacts.show');
        Route::get('blade/registrations', [AdminRegistrationController::class, 'index'])->name('registrations.index');
        Route::get('blade/registrations/{registration}', [AdminRegistrationController::class, 'show'])->name('registrations.show');
        Route::get('blade/sections', [SiteSectionController::class, 'index'])->name('sections.index');
        Route::get('blade/sections/{key}/edit', [SiteSectionController::class, 'edit'])->name('sections.edit');
        Route::put('blade/sections/{key}', [SiteSectionController::class, 'update'])->name('sections.update');
        Route::resource('blade/events', CmsEventController::class)->except(['show']);
        Route::resource('blade/gallery', CmsGalleryItemController::class)->except(['show'])->parameters(['gallery' => 'gallery']);
        Route::prefix('blade/cms')->name('cms.blade.')->group(function () {
            Route::resource('pages', CmsPageController::class)->except(['show']);
            Route::resource('slides', CmsHeroSlideController::class)->except(['show']);
            Route::resource('nav', CmsNavItemController::class)->except(['show'])->parameters(['nav' => 'nav']);
            Route::get('media', [CmsMediaController::class, 'index'])->name('media.index');
            Route::post('media', [CmsMediaController::class, 'store'])->name('media.store');
            Route::delete('media/{medium}', [CmsMediaController::class, 'destroy'])->name('media.destroy');
        });
    });
});
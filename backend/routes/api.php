<?php

use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\ContentController;
use App\Http\Controllers\Api\RegistrationController;
use App\Http\Controllers\Api\VisitController;
use App\Http\Controllers\Api\SettingsController;
use Illuminate\Support\Facades\Route;

Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'service' => 'CQPM Nador API',
        'time' => now()->toIso8601String(),
    ]);
});

Route::get('/content', [ContentController::class, 'index']);
Route::get('/content/pages/{slug}', [ContentController::class, 'show'])->where('slug', '.*');
Route::get('/settings', [SettingsController::class, 'index']);

Route::post('/contact', [ContactController::class, 'store']);
Route::post('/registration', [RegistrationController::class, 'store']);
Route::post('/visit', [VisitController::class, 'store']);

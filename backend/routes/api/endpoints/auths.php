<?php

declare(strict_types=1);

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\LogoutController;
use App\Http\Controllers\Auth\UserController;
use Illuminate\Support\Facades\Route;

Route::post('/login', LoginController::class)->name('login');
// 認証必要ルート
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', UserController::class);
    Route::post('/logout', LogoutController::class);
});
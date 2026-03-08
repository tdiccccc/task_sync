<?php

declare(strict_types=1);

use App\Http\Controllers\Project\CreateController;
use App\Http\Controllers\Project\DeleteController;
use App\Http\Controllers\Project\GetDetailController;
use App\Http\Controllers\Project\GetListController;
use App\Http\Controllers\Project\UpdateController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/projects', GetListController::class);
    Route::post('/projects', CreateController::class);
    Route::get('/projects/{id}', GetDetailController::class);
    Route::put('/projects/{id}', UpdateController::class);
    Route::delete('/projects/{id}', DeleteController::class);
});
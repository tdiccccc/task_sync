<?php

namespace App\Providers;

use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->defineGates();
    }

    /**
     * Gate（認可ルール）を定義
     */
    private function defineGates(): void
    {
        // 管理者権限
        Gate::define('admin', function ($user) {
            return $user->hasRole('admin');
        });

        // メンバー権限（admin も含む）
        Gate::define('member', function ($user) {
            return $user->hasRole('admin') || $user->hasRole('member');
        });
    }
}
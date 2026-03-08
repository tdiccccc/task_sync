<?php

namespace Database\Seeders;

use Database\Seeders\AdminUserTableSeeder;
use Database\Seeders\MemberUserTableSeeder;
use Database\Seeders\RoleTableSeeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        DB::transaction(function () {
            // ここにシーダーの呼び出しを追加
             $this->call([
                RoleTableSeeder::class,
                AdminUserTableSeeder::class,
                MemberUserTableSeeder::class,
            ]);
        });
    }
}

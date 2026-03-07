<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoleTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $records = [
            [1, 'admin'],
            [2, 'member'],
        ];

        foreach ($records as $record) {
            $id = $record[0];
            $exists = DB::table('roles')->where('id', $id)->exists();

            if (!$exists) {
                DB::table('roles')->insert([
                    'id' => $id,
                    'name' => $record[1],
                    'created_at' => '2026-03-08 00:00:00',
                    'updated_at' => '2026-03-08 00:00:00',
                ]);
            }
        }
    }
}
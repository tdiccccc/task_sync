<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class MemberUserTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $records = [
            [ 2,'テストメンバー','member@test.com', 'password0800', 1]
        ];

        foreach ($records as $record) {
            $id = $record[0];
            $exists = DB::table('users')->where('id', $id)->exists();

            if (!$exists) {
                DB::table('users')->insert([
                    'id' => $id,
                    'name' => $record[1],
                    'email' => $record[2],
                    'password' => Hash::make($record[3]), // パスワードをハッシュ化
                    'is_valid' => $record[4],
                    'created_at' => '2026-03-08 00:00:00',
                    'updated_at' => '2026-03-08 00:00:00',
                ]);

                // メンバー権限を付与
                $user = User::find($id);
                $user->roles()->attach(Role::where('name', 'member')->first());
            }
        }
    }
}
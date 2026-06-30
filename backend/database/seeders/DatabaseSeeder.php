<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => env('ADMIN_EMAIL', 'admin@cqpm.ma')],
            [
                'name' => env('ADMIN_NAME', 'CQPM Admin'),
                'password' => Hash::make(env('ADMIN_PASSWORD', 'changeme')),
            ]
        );

        $this->call(CmsSeeder::class);
        $this->call(SiteSectionSeeder::class);
    }
}

<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed categories and initial data
        $this->call([
            ArticleCategorySeeder::class,
            SpecializationSeeder::class,
            LibraryCategorySeeder::class,
            LegalResourceCategorySeeder::class,
        ]);

        // Create admin user
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role' => 'Admin',
            'joined_at' => now(),
        ]);

        // Create sample therapist user
        $therapistUser = User::create([
            'name' => 'Dr. Sample Therapist',
            'email' => 'therapist@example.com',
            'password' => Hash::make('password'),
            'role' => 'Therapist',
            'joined_at' => now(),
        ]);

        // Create sample client user
        User::create([
            'name' => 'Sample Client',
            'email' => 'client@example.com',
            'password' => Hash::make('password'),
            'role' => 'Client',
            'joined_at' => now(),
        ]);
    }
}

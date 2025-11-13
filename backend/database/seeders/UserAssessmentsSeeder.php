<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\User;
use App\Models\UserAssessment;
use App\Models\PsychologicalScale;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UserAssessmentsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        UserAssessment::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1');

        // الحصول على المستخدمين (إذا كان لديك نظام مستخدمين)
        $users = User::take(10)->get();
        
        // إذا لم يكن هناك مستخدمين، أنشئ بعض المستخدمين التجريبية
        if ($users->isEmpty()) {
            $users = User::factory()->count(5)->create();
        }

        // الحصول على المقاييس النشطة
        $scales = PsychologicalScale::where('is_active', true)->get();

        if ($scales->isEmpty()) {
            $this->command->warn('⚠️  لا توجد مقاييس نشطة. يرجى تشغيل PsychologicalScalesSeeder أولاً.');
            return;
        }

        $this->command->info('🎯 بدء إنشاء التقييمات...');

        // إنشاء تقييمات لكل مستخدم
        foreach ($users as $user) {
            $userAssessmentsCount = rand(3, 8); // 3-8 تقييم لكل مستخدم
            
            for ($i = 0; $i < $userAssessmentsCount; $i++) {
                $randomScale = $scales->random();
                
                UserAssessment::factory()
                    ->forUser($user->id)
                    ->forScale($randomScale->id)
                    ->create();
            }

            $this->command->info("✅ تم إنشاء {$userAssessmentsCount} تقييم للمستخدم {$user->id}");
        }

        // إنشاء بعض التقييمات الإضافية
        $additionalAssessments = UserAssessment::factory()
            ->count(15)
            ->create();

        $totalAssessments = UserAssessment::count();
        $this->command->info("🎉 تم إنشاء {$totalAssessments} تقييم بنجاح!");
        
        $this->command->info('📊 إحصائيات التقييمات:');
        $this->command->info('   - إجمالي التقييمات: ' . $totalAssessments);
        $this->command->info('   - متوسط النتائج: ' . round(UserAssessment::avg('total_score'), 2));
        $this->command->info('   - أحدث تقييم: ' . UserAssessment::max('completed_at'));
    }
}

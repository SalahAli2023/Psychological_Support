<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Category;
use App\Models\PsychologicalScale;
use App\Models\ScaleQuestion;
use App\Models\QuestionOption;
use App\Models\ResultInterpretation;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PsychologicalScalesSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        
        Category::truncate();
        PsychologicalScale::truncate();
        ScaleQuestion::truncate();
        QuestionOption::truncate();
        ResultInterpretation::truncate();
        
        DB::statement('SET FOREIGN_KEY_CHECKS=1');

        // إنشاء الفئات
        $womenCategory = Category::create([
            'id' => \Illuminate\Support\Str::uuid(),
            'name_ar' => 'صحة المرأة النفسية',
            'name_en' => 'Women Mental Health',
            'description_ar' => 'مقاييس متخصصة لصحة المرأة النفسية والتربوية',
            'description_en' => 'Specialized scales for women mental and educational health',
            'color' => '#EC4899',
            'is_active' => true,
        ]);

        $childrenCategory = Category::create([
            'id' => \Illuminate\Support\Str::uuid(),
            'name_ar' => 'صحة الطفل النفسية',
            'name_en' => 'Children Mental Health',
            'description_ar' => 'مقاييس مصممة خصيصاً للأطفال والمراهقين',
            'description_en' => 'Scales specifically designed for children and adolescents',
            'color' => '#3B82F6',
            'is_active' => true,
        ]);

        // إنشاء مقاييس المرأة
        $this->createAnxietyScale($womenCategory);
        $this->createDepressionScale($womenCategory);
        
        // إنشاء مقاييس الأطفال
        $this->createChildADHDScale($childrenCategory);
        $this->createChildDepressionScale($childrenCategory);

        $this->command->info('✅ تم إنشاء البيانات بنجاح!');
        $this->command->info('📊 عدد الفئات: ' . Category::count());
        $this->command->info('📈 عدد المقاييس: ' . PsychologicalScale::count());
        $this->command->info('❓ عدد الأسئلة: ' . ScaleQuestion::count());
    }

    private function createAnxietyScale(Category $category): void
    {
        $scale = PsychologicalScale::create([
            'id' => \Illuminate\Support\Str::uuid(),
            'category_id' => $category->id,
            'name_ar' => 'مقياس القلق',
            'name_en' => 'Anxiety Scale',
            'description_ar' => 'مقياس معتمد عالمياً لتقييم أعراض القلق العام وشدتها',
            'description_en' => 'Internationally certified scale to assess general anxiety symptoms',
            'image_url' => 'https://picsum.photos/seed/anxiety/400/300',
            'max_score' => 21,
            'is_active' => true,
        ]);

        // الأسئلة
        $questions = [
            [
                'question_text_ar' => 'خلال الأسبوعين الماضيين، كم مرة شعرت بالتوتر أو القلق؟',
                'question_text_en' => 'Over the last two weeks, how often have you felt nervous or anxious?',
                'options' => [
                    ['option_text_ar' => 'أبداً', 'option_text_en' => 'Not at all', 'score_value' => 0],
                    ['option_text_ar' => 'عدة أيام', 'option_text_en' => 'Several days', 'score_value' => 1],
                    ['option_text_ar' => 'أكثر من نصف الأيام', 'option_text_en' => 'More than half the days', 'score_value' => 2],
                    ['option_text_ar' => 'تقريباً كل يوم', 'option_text_en' => 'Nearly every day', 'score_value' => 3],
                ]
            ],
            [
                'question_text_ar' => 'كم مرة وجدت صعوبة في التوقف عن القلق؟',
                'question_text_en' => 'How often have you been unable to stop worrying?',
                'options' => [
                    ['option_text_ar' => 'أبداً', 'option_text_en' => 'Not at all', 'score_value' => 0],
                    ['option_text_ar' => 'عدة أيام', 'option_text_en' => 'Several days', 'score_value' => 1],
                    ['option_text_ar' => 'أكثر من نصف الأيام', 'option_text_en' => 'More than half the days', 'score_value' => 2],
                    ['option_text_ar' => 'تقريباً كل يوم', 'option_text_en' => 'Nearly every day', 'score_value' => 3],
                ]
            ],
        ];

        $this->createQuestionsWithOptions($scale, $questions);

        // تفسيرات النتائج
        $interpretations = [
            ['min_score' => 0, 'max_score' => 4, 'interpretation_label_ar' => 'قلق طفيف', 'interpretation_label_en' => 'Minimal Anxiety', 'color' => '#10B981'],
            ['min_score' => 5, 'max_score' => 9, 'interpretation_label_ar' => 'قلق بسيط', 'interpretation_label_en' => 'Mild Anxiety', 'color' => '#3B82F6'],
            ['min_score' => 10, 'max_score' => 14, 'interpretation_label_ar' => 'قلق متوسط', 'interpretation_label_en' => 'Moderate Anxiety', 'color' => '#F59E0B'],
            ['min_score' => 15, 'max_score' => 21, 'interpretation_label_ar' => 'قلق شديد', 'interpretation_label_en' => 'Severe Anxiety', 'color' => '#EF4444'],
        ];

        $this->createInterpretations($scale, $interpretations);
    }

    private function createDepressionScale(Category $category): void
    {
        $scale = PsychologicalScale::create([
            'id' => \Illuminate\Support\Str::uuid(),
            'category_id' => $category->id,
            'name_ar' => 'مقياس الاكتئاب',
            'name_en' => 'Depression Scale',
            'description_ar' => 'تقييم لمشاعر الحزن والاكتئاب وتأثيرها على الحياة اليومية',
            'description_en' => 'Assessment of sadness and depression feelings and their impact on daily life',
            'image_url' => 'https://picsum.photos/seed/depression/400/300',
            'max_score' => 27,
            'is_active' => true,
        ]);

        // يمكنك إضافة المزيد من الأسئلة هنا بنفس الطريقة
        $questions = [
            [
                'question_text_ar' => 'شعرت بالحزن أو الاكتئاب معظم الوقت',
                'question_text_en' => 'I felt sad or depressed most of the time',
                'options' => [
                    ['option_text_ar' => 'أبداً', 'option_text_en' => 'Never', 'score_value' => 0],
                    ['option_text_ar' => 'أحياناً', 'option_text_en' => 'Sometimes', 'score_value' => 1],
                    ['option_text_ar' => 'غالباً', 'option_text_en' => 'Often', 'score_value' => 2],
                    ['option_text_ar' => 'دائماً', 'option_text_en' => 'Always', 'score_value' => 3],
                ]
            ],
        ];

        $this->createQuestionsWithOptions($scale, $questions);
    }

    private function createChildADHDScale(Category $category): void
    {
        $scale = PsychologicalScale::create([
            'id' => \Illuminate\Support\Str::uuid(),
            'category_id' => $category->id,
            'name_ar' => 'مقياس فرط النشاط ونقص الانتباه',
            'name_en' => 'ADHD Scale',
            'description_ar' => 'تقييم أعراض فرط النشاط ونقص الانتباه لدى الأطفال',
            'description_en' => 'Assessment of hyperactivity and attention deficit symptoms in children',
            'image_url' => 'https://picsum.photos/seed/adhd/400/300',
            'max_score' => 24,
            'is_active' => true,
        ]);

        // إضافة الأسئلة والتفسيرات بنفس الطريقة
    }

    private function createChildDepressionScale(Category $category): void
    {
        $scale = PsychologicalScale::create([
            'id' => \Illuminate\Support\Str::uuid(),
            'category_id' => $category->id,
            'name_ar' => 'مقياس اكتئاب الأطفال',
            'name_en' => 'Child Depression Scale',
            'description_ar' => 'تقييم مشاعر الحزن والاكتئاب لدى الأطفال والمراهقين',
            'description_en' => 'Assessment of sadness and depression feelings in children and adolescents',
            'image_url' => 'https://picsum.photos/seed/child-depression/400/300',
            'max_score' => 24,
            'is_active' => true,
        ]);

        // إضافة الأسئلة والتفسيرات بنفس الطريقة
    }

    private function createQuestionsWithOptions(PsychologicalScale $scale, array $questions): void
    {
        $questionOrder = 1;
        foreach ($questions as $questionData) {
            $question = ScaleQuestion::create([
                'id' => \Illuminate\Support\Str::uuid(),
                'scale_id' => $scale->id,
                'question_text_ar' => $questionData['question_text_ar'],
                'question_text_en' => $questionData['question_text_en'],
                'question_order' => $questionOrder,
            ]);

            $optionOrder = 1;
            foreach ($questionData['options'] as $optionData) {
                QuestionOption::create([
                    'id' => \Illuminate\Support\Str::uuid(),
                    'question_id' => $question->id,
                    'option_text_ar' => $optionData['option_text_ar'],
                    'option_text_en' => $optionData['option_text_en'],
                    'score_value' => $optionData['score_value'],
                    'option_order' => $optionOrder,
                ]);
                $optionOrder++;
            }

            $questionOrder++;
        }
    }

    private function createInterpretations(PsychologicalScale $scale, array $interpretations): void
    {
        foreach ($interpretations as $interpretationData) {
            ResultInterpretation::create(array_merge($interpretationData, [
                'id' => \Illuminate\Support\Str::uuid(),
                'scale_id' => $scale->id,
                'description_ar' => 'تفسير النتائج لمستوى ' . $interpretationData['interpretation_label_ar'],
                'description_en' => 'Interpretation for ' . $interpretationData['interpretation_label_en'] . ' level',
            ]));
        }
    }
}

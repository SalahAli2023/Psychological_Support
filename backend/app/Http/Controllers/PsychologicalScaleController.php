<?php

namespace App\Http\Controllers;

use App\Models\PsychologicalScale;
use App\Models\ScaleQuestion;
use App\Models\QuestionOption;
use App\Models\ResultInterpretation;
use App\Http\Resources\PsychologicalScaleResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;

class PsychologicalScaleController extends Controller
{
    /**
     * عرض جميع المقاييس
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = PsychologicalScale::query();

        // التحميل مع العلاقات
        $query->with(['category', 'questions.options', 'interpretations']);

        // التصفية حسب الفئة
        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        // التصفية حسب الحالة
        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        // البحث
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name_ar', 'like', "%{$search}%")
                  ->orWhere('name_en', 'like', "%{$search}%")
                  ->orWhere('description_ar', 'like', "%{$search}%")
                  ->orWhere('description_en', 'like', "%{$search}%");
            });
        }

        // الترتيب
        $sortField = $request->get('sort_field', 'created_at');
        $sortDirection = $request->get('sort_direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        $scales = $query->paginate($request->get('per_page', 15));

        return PsychologicalScaleResource::collection($scales);
    }

    /**
     * إنشاء مقياس جديد
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name_ar' => 'required|string|max:255',
            'name_en' => 'required|string|max:255',
            'description_ar' => 'nullable|string',
            'description_en' => 'nullable|string',
            'image_url' => 'nullable|url|max:5000',
            'max_score' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
        ]);

        DB::beginTransaction();

        try {
            $scale = PsychologicalScale::create($validated);

            DB::commit();

            return response()->json([
                'message' => 'تم إنشاء المقياس بنجاح',
                'data' => new PsychologicalScaleResource($scale->load(['category', 'questions', 'interpretations']))
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'فشل في إنشاء المقياس',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * عرض مقياس محدد
     */
    public function show(PsychologicalScale $psychologicalScale): PsychologicalScaleResource
    {
        $psychologicalScale->load([
            'category',
            'questions.options',
            'interpretations'
        ]);

        return new PsychologicalScaleResource($psychologicalScale);
    }

    /**
     * تحديث مقياس
     */
    public function update(Request $request, PsychologicalScale $psychologicalScale): JsonResponse
    {
        $validated = $request->validate([
            'category_id' => 'sometimes|required|exists:categories,id',
            'name_ar' => 'sometimes|required|string|max:255',
            'name_en' => 'sometimes|required|string|max:255',
            'description_ar' => 'nullable|string',
            'description_en' => 'nullable|string',
            'image_url' => 'nullable|url|max:5000',
            'max_score' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
        ]);

        $psychologicalScale->update($validated);

        return response()->json([
            'message' => 'تم تحديث المقياس بنجاح',
            'data' => new PsychologicalScaleResource($psychologicalScale->fresh()->load(['category', 'questions', 'interpretations']))
        ]);
    }

    /**
     * حذف مقياس
     */
    public function destroy(PsychologicalScale $psychologicalScale): JsonResponse
    {
        DB::beginTransaction();

        try {
            $psychologicalScale->delete();

            DB::commit();

            return response()->json([
                'message' => 'تم حذف المقياس بنجاح'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'فشل في حذف المقياس',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * المقاييس النشطة فقط
     */
    public function active(): AnonymousResourceCollection
    {
        $scales = PsychologicalScale::where('is_active', true)
            ->with(['category', 'questions.options'])
            ->orderBy('name_ar')
            ->get();

        return PsychologicalScaleResource::collection($scales);
    }

    /**
     * تفعيل/تعطيل المقياس
     */
    public function toggleStatus(PsychologicalScale $psychologicalScale): JsonResponse
    {
        $psychologicalScale->update([
            'is_active' => !$psychologicalScale->is_active
        ]);

        $status = $psychologicalScale->is_active ? 'مفعل' : 'معطل';

        return response()->json([
            'message' => "تم {$status} المقياس بنجاح",
            'data' => new PsychologicalScaleResource($psychologicalScale)
        ]);
    }

    /**
     * الحصول على مقياس كامل مع أسئلته وخياراته
     */
    public function getFullScale($id): PsychologicalScaleResource
    {
        $scale = PsychologicalScale::where('id', $id)
            ->where('is_active', true)
            ->with(['questions' => function($query) {
                $query->orderBy('question_order')
                      ->with(['options' => function($query) {
                          $query->orderBy('option_order');
                      }]);
            }, 'interpretations'])
            ->firstOrFail();

        return new PsychologicalScaleResource($scale);
    }

    /**
     * المقاييس حسب الفئة
     */
    public function byCategory($categoryId): AnonymousResourceCollection
    {
        $scales = PsychologicalScale::where('category_id', $categoryId)
            ->where('is_active', true)
            ->with(['category'])
            ->orderBy('name_ar')
            ->get();

        return PsychologicalScaleResource::collection($scales);
    }

    /**
     *  تحديث مقياس كامل مع جميع العلاقات في طلب واحد
     */
    public function updateFullScale(Request $request, PsychologicalScale $psychologicalScale): JsonResponse
    {
        DB::beginTransaction();

        try {
            // 1. تحديث البيانات الأساسية للمقياس
            $scaleData = $request->only([
                'category_id', 'name_ar', 'name_en', 'description_ar', 
                'description_en', 'image_url', 'max_score', 'is_active'
            ]);

            $psychologicalScale->update($scaleData);

            // 2. معالجة الأسئلة والخيارات
            if ($request->has('questions')) {
                $this->syncQuestions($psychologicalScale, $request->questions);
            }

            // 3. معالجة تفسيرات النتائج
            if ($request->has('interpretations')) {
                $this->syncInterpretations($psychologicalScale, $request->interpretations);
            }

            DB::commit();

            // إعادة تحميل العلاقات
            $psychologicalScale->load(['category', 'questions.options', 'interpretations']);

            return response()->json([
                'message' => 'تم تحديث المقياس بنجاح',
                'data' => new PsychologicalScaleResource($psychologicalScale)
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'فشل في تحديث المقياس',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     *  مزامنة الأسئلة والخيارات
     */
    private function syncQuestions(PsychologicalScale $scale, array $questions): void
    {
        $existingQuestionIds = [];
        
        foreach ($questions as $questionData) {
            if (isset($questionData['id'])) {
                // تحديث السؤال الموجود
                $question = ScaleQuestion::where('id', $questionData['id'])
                                       ->where('scale_id', $scale->id)
                                       ->first();
                if ($question) {
                    $question->update([
                        'question_text_ar' => $questionData['question_text_ar'],
                        'question_text_en' => $questionData['question_text_en'],
                        'question_order' => $questionData['question_order'] ?? 1
                    ]);
                    $this->syncOptions($question, $questionData['options'] ?? []);
                    $existingQuestionIds[] = $question->id;
                }
            } else {
                // إنشاء سؤال جديد
                $question = $scale->questions()->create([
                    'question_text_ar' => $questionData['question_text_ar'],
                    'question_text_en' => $questionData['question_text_en'],
                    'question_order' => $questionData['question_order'] ?? 1
                ]);
                $this->syncOptions($question, $questionData['options'] ?? []);
                $existingQuestionIds[] = $question->id;
            }
        }
        
        // حذف الأسئلة المحذوفة
        $scale->questions()->whereNotIn('id', $existingQuestionIds)->delete();
    }

    /**
     *  مزامنة خيارات السؤال
     */
    private function syncOptions(ScaleQuestion $question, array $options): void
    {
        $existingOptionIds = [];
        
        foreach ($options as $optionData) {
            if (isset($optionData['id'])) {
                // تحديث الخيار الموجود
                $option = QuestionOption::where('id', $optionData['id'])
                                      ->where('question_id', $question->id)
                                      ->first();
                if ($option) {
                    $option->update([
                        'option_text_ar' => $optionData['option_text_ar'],
                        'option_text_en' => $optionData['option_text_en'],
                        'score_value' => $optionData['score_value'] ?? 0,
                        'option_order' => $optionData['option_order'] ?? 1
                    ]);
                    $existingOptionIds[] = $option->id;
                }
            } else {
                // إنشاء خيار جديد
                $option = $question->options()->create([
                    'option_text_ar' => $optionData['option_text_ar'],
                    'option_text_en' => $optionData['option_text_en'],
                    'score_value' => $optionData['score_value'] ?? 0,
                    'option_order' => $optionData['option_order'] ?? 1
                ]);
                $existingOptionIds[] = $option->id;
            }
        }
        
        // حذف الخيارات المحذوفة
        $question->options()->whereNotIn('id', $existingOptionIds)->delete();
    }

    /**
     * 🔥 مزامنة تفسيرات النتائج
     */
    private function syncInterpretations(PsychologicalScale $scale, array $interpretations): void
    {
        $existingInterpretationIds = [];
        
        foreach ($interpretations as $interpretationData) {
            if (isset($interpretationData['id'])) {
                // تحديث التفسير الموجود
                $interpretation = ResultInterpretation::where('id', $interpretationData['id'])
                                                    ->where('scale_id', $scale->id)
                                                    ->first();
                if ($interpretation) {
                    $interpretation->update([
                        'min_score' => $interpretationData['min_score'] ?? 0,
                        'max_score' => $interpretationData['max_score'] ?? 10,
                        'interpretation_label_ar' => $interpretationData['interpretation_label_ar'],
                        'interpretation_label_en' => $interpretationData['interpretation_label_en'],
                        'description_ar' => $interpretationData['description_ar'] ?? '',
                        'description_en' => $interpretationData['description_en'] ?? '',
                        'color' => $interpretationData['color'] ?? 'blue'
                    ]);
                    $existingInterpretationIds[] = $interpretation->id;
                }
            } else {
                // إنشاء تفسير جديد
                $interpretation = $scale->interpretations()->create([
                    'min_score' => $interpretationData['min_score'] ?? 0,
                    'max_score' => $interpretationData['max_score'] ?? 10,
                    'interpretation_label_ar' => $interpretationData['interpretation_label_ar'],
                    'interpretation_label_en' => $interpretationData['interpretation_label_en'],
                    'description_ar' => $interpretationData['description_ar'] ?? '',
                    'description_en' => $interpretationData['description_en'] ?? '',
                    'color' => $interpretationData['color'] ?? 'blue'
                ]);
                $existingInterpretationIds[] = $interpretation->id;
            }
        }
        
        // حذف التفسيرات المحذوفة
        $scale->interpretations()->whereNotIn('id', $existingInterpretationIds)->delete();
    }
}
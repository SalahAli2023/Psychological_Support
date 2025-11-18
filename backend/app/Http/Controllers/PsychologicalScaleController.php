<?php

namespace App\Http\Controllers;

use App\Models\PsychologicalScale;
use App\Http\Resources\PsychologicalScaleResource;
use Illuminate\Http\Request;

class PsychologicalScaleController extends Controller
{
    /**
     * عرض جميع المقاييس النفسية مع كل العلاقات
     */
    public function index()
    {
        try {
            $scales = PsychologicalScale::with([
                'category',
                'questions.options',
                'interpretations'
            ])
            ->where('is_active', true)
            ->orderBy('created_at', 'desc')
            ->get();

            return PsychologicalScaleResource::collection($scales);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch psychological scales',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * عرض مقياس نفسي محدد مع كل العلاقات
     */
    public function show($id)
    {
        try {
            $scale = PsychologicalScale::with([
                'category',
                'questions' => function($query) {
                    $query->orderBy('question_order');
                },
                'questions.options' => function($query) {
                    $query->orderBy('option_order');
                },
                'interpretations' => function($query) {
                    $query->orderBy('min_score');
                }
            ])
            ->where('is_active', true)
            ->findOrFail($id);

            return new PsychologicalScaleResource($scale);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Psychological scale not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * إنشاء مقياس نفسي جديد مع البيانات المرتبطة
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'category_id' => 'required|exists:categories,id',
                'name_ar' => 'required|string|max:255',
                'name_en' => 'required|string|max:255',
                'description_ar' => 'nullable|string',
                'description_en' => 'nullable|string',
                'image_url' => 'nullable|url',
                'max_score' => 'required|integer|min:1',
                'is_active' => 'boolean',
                
                // بيانات الأسئلة
                'questions' => 'nullable|array',
                'questions.*.question_text_ar' => 'required|string',
                'questions.*.question_text_en' => 'required|string',
                'questions.*.question_order' => 'required|integer',
                'questions.*.options' => 'required|array|min:2',
                'questions.*.options.*.option_text_ar' => 'required|string',
                'questions.*.options.*.option_text_en' => 'required|string',
                'questions.*.options.*.score_value' => 'required|integer',
                'questions.*.options.*.option_order' => 'required|integer',
                
                // بيانات التفسيرات
                'interpretations' => 'nullable|array',
                'interpretations.*.min_score' => 'required|integer',
                'interpretations.*.max_score' => 'required|integer',
                'interpretations.*.interpretation_label_ar' => 'required|string',
                'interpretations.*.interpretation_label_en' => 'required|string',
                'interpretations.*.description_ar' => 'nullable|string',
                'interpretations.*.description_en' => 'nullable|string',
                'interpretations.*.color' => 'nullable|string',
            ]);

            // بدء المعاملة
            return \DB::transaction(function () use ($validated) {
                // إنشاء المقياس النفسي
                $scale = PsychologicalScale::create([
                    'id' => \Str::uuid(),
                    'category_id' => $validated['category_id'],
                    'name_ar' => $validated['name_ar'],
                    'name_en' => $validated['name_en'],
                    'description_ar' => $validated['description_ar'] ?? null,
                    'description_en' => $validated['description_en'] ?? null,
                    'image_url' => $validated['image_url'] ?? null,
                    'max_score' => $validated['max_score'],
                    'is_active' => $validated['is_active'] ?? true,
                ]);

                // إنشاء الأسئلة والخيارات
                if (isset($validated['questions'])) {
                    foreach ($validated['questions'] as $questionData) {
                        $question = $scale->questions()->create([
                            'id' => \Str::uuid(),
                            'question_text_ar' => $questionData['question_text_ar'],
                            'question_text_en' => $questionData['question_text_en'],
                            'question_order' => $questionData['question_order'],
                        ]);

                        // إنشاء خيارات السؤال
                        foreach ($questionData['options'] as $optionData) {
                            $question->options()->create([
                                'id' => \Str::uuid(),
                                'option_text_ar' => $optionData['option_text_ar'],
                                'option_text_en' => $optionData['option_text_en'],
                                'score_value' => $optionData['score_value'],
                                'option_order' => $optionData['option_order'],
                            ]);
                        }
                    }
                }

                // إنشاء تفسيرات النتائج
                if (isset($validated['interpretations'])) {
                    foreach ($validated['interpretations'] as $interpretationData) {
                        $scale->interpretations()->create([
                            'id' => \Str::uuid(),
                            'min_score' => $interpretationData['min_score'],
                            'max_score' => $interpretationData['max_score'],
                            'interpretation_label_ar' => $interpretationData['interpretation_label_ar'],
                            'interpretation_label_en' => $interpretationData['interpretation_label_en'],
                            'description_ar' => $interpretationData['description_ar'] ?? null,
                            'description_en' => $interpretationData['description_en'] ?? null,
                            'color' => $interpretationData['color'] ?? null,
                        ]);
                    }
                }

                // تحميل العلاقات وإرجاع النتيجة
                $scale->load(['category', 'questions.options', 'interpretations']);

                return response()->json([
                    'message' => 'Psychological scale created successfully',
                    'data' => new PsychologicalScaleResource($scale)
                ], 201);
            });

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create psychological scale',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * تحديث مقياس نفسي
     */
    public function update(Request $request, $id)
    {
        try {
            $scale = PsychologicalScale::findOrFail($id);

            $validated = $request->validate([
                'category_id' => 'sometimes|exists:categories,id',
                'name_ar' => 'sometimes|string|max:255',
                'name_en' => 'sometimes|string|max:255',
                'description_ar' => 'nullable|string',
                'description_en' => 'nullable|string',
                'image_url' => 'nullable|url',
                'max_score' => 'sometimes|integer|min:1',
                'is_active' => 'sometimes|boolean',
            ]);

            $scale->update($validated);

            $scale->load(['category', 'questions.options', 'interpretations']);

            return response()->json([
                'message' => 'Psychological scale updated successfully',
                'data' => new PsychologicalScaleResource($scale)
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update psychological scale',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * حذف مقياس نفسي
     */
    public function destroy($id)
    {
        try {
            $scale = PsychologicalScale::findOrFail($id);

            // حذف جميع البيانات المرتبطة
            \DB::transaction(function () use ($scale) {
                // حذف خيارات الأسئلة أولاً
                foreach ($scale->questions as $question) {
                    $question->options()->delete();
                }
                
                // ثم حذف الأسئلة
                $scale->questions()->delete();
                
                // حذف تفسيرات النتائج
                $scale->interpretations()->delete();
                
                // حذف التقييمات المرتبطة
                $scale->assessments()->delete();
                
                // أخيراً حذف المقياس
                $scale->delete();
            });

            return response()->json([
                'message' => 'Psychological scale deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete psychological scale',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
<?php

namespace App\Http\Controllers\Api;

use App\Models\PsychologicalScale;
use App\Http\Controllers\Controller;
use App\Http\Resources\PsychologicalScaleResource;
use App\Http\Resources\PsychologicalScaleWithQuestionsResource;
use App\Http\Resources\ScaleQuestionResource;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PsychologicalScaleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = PsychologicalScale::with(['category', 'questions'])
            ->withCount('questions')
            ->where('is_active', true);

        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        $scales = $query->orderBy('name_ar')->get();

        return response()->json([
            'success' => true,
            'data' => PsychologicalScaleResource::collection($scales)
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name_ar' => 'required|string|max:255',
            'name_en' => 'required|string|max:255',
            'description_ar' => 'nullable|string',
            'description_en' => 'nullable|string',
            'image_url' => 'nullable|url|max:500',
            'max_score' => 'nullable|integer|min:1',
        ]);

        $scale = PsychologicalScale::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'تم إنشاء المقياس بنجاح',
            'data' => new PsychologicalScaleResource($scale)
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $scale = PsychologicalScale::with(['category', 'questions.options', 'interpretations'])
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => new PsychologicalScaleWithQuestionsResource($scale)
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id): JsonResponse
    {
        $scale = PsychologicalScale::findOrFail($id);

        $validated = $request->validate([
            'category_id' => 'sometimes|exists:categories,id',
            'name_ar' => 'sometimes|string|max:255',
            'name_en' => 'sometimes|string|max:255',
            'description_ar' => 'nullable|string',
            'description_en' => 'nullable|string',
            'image_url' => 'nullable|url|max:500',
            'max_score' => 'nullable|integer|min:1',
            'is_active' => 'sometimes|boolean',
        ]);

        $scale->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'تم تحديث المقياس بنجاح',
            'data' => new PsychologicalScaleResource($scale)
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id): JsonResponse
    {
        $scale = PsychologicalScale::findOrFail($id);

        // التحقق من عدم وجود تقييمات مرتبطة
        if ($scale->assessments()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'لا يمكن حذف المقياس لأنه يحتوي على تقييمات'
            ], 422);
        }

        $scale->delete();

        return response()->json([
            'success' => true,
            'message' => 'تم حذف المقياس بنجاح'
        ]);
    }

    public function getQuestions($id): JsonResponse
    {
        $scale = PsychologicalScale::findOrFail($id);
        
        $questions = $scale->questions()
            ->with('options')
            ->orderBy('question_order')
            ->get();

        return response()->json([
            'success' => true,
            'data' => ScaleQuestionResource::collection($questions)
        ]);
    }
}

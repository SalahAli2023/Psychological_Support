<?php

namespace App\Http\Controllers;

use App\Models\PsychologicalScale;
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
            'image_url' => 'nullable|url|max:500',
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
            'image_url' => 'nullable|url|max:500',
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
}
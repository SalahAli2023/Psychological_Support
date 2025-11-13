<?php

namespace App\Http\Controllers\Api;

use App\Models\Category;
use App\Http\Controllers\Controller;
use App\Http\Resources\ScaleCategoryResource;
use App\Http\Resources\PsychologicalScaleResource;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ScaleCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $categories = Category::withCount('psychologicalScales')
            ->where('is_active', true)
            ->orderBy('name_ar')
            ->get();

        return response()->json([
            'success' => true,
            'data' => ScaleCategoryResource::collection($categories)
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name_ar' => 'required|string|max:100',
            'name_en' => 'required|string|max:100',
            'description_ar' => 'nullable|string',
            'description_en' => 'nullable|string',
            'color' => 'nullable|string|max:20',
        ]);

        $category = Category::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'تم إنشاء الفئة بنجاح',
            'data' => new ScaleCategoryResource($category)
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id): JsonResponse
    {
        $category = Category::with(['psychologicalScales' => function($query) {
            $query->where('is_active', true);
        }])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => new ScaleCategoryResource($category)
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id): JsonResponse
    {
        $category = Category::findOrFail($id);

        $validated = $request->validate([
            'name_ar' => 'sometimes|string|max:100',
            'name_en' => 'sometimes|string|max:100',
            'description_ar' => 'nullable|string',
            'description_en' => 'nullable|string',
            'color' => 'nullable|string|max:20',
            'is_active' => 'sometimes|boolean',
        ]);

        $category->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'تم تحديث الفئة بنجاح',
            'data' => new ScaleCategoryResource($category)
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id): JsonResponse
    {
        $category = Category::findOrFail($id);

        // التحقق من عدم وجود مقاييس مرتبطة
        if ($category->psychologicalScales()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'لا يمكن حذف الفئة لأنها تحتوي على مقاييس'
            ], 422);
        }

        $category->delete();

        return response()->json([
            'success' => true,
            'message' => 'تم حذف الفئة بنجاح'
        ]);
    }

    public function getScales($id): JsonResponse
    {
        $category = Category::findOrFail($id);
        
        $scales = $category->psychologicalScales()
            ->where('is_active', true)
            ->withCount('questions')
            ->orderBy('name_ar')
            ->get();

        return response()->json([
            'success' => true,
            'data' => PsychologicalScaleResource::collection($scales)
        ]);
    }
}

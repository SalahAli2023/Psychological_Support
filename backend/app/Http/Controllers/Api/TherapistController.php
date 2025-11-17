<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TherapistResource;
use App\Models\Therapist;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TherapistController extends Controller
{
    /**
     * عرض قائمة المعالجين
     */
    public function index(Request $request): JsonResponse
    {
        $query = Therapist::with(['qualifications', 'certifications', 'schedules']);

        // التصفية حسب التخصص
        if ($request->has('specialty')) {
            $query->where('specialty_en', 'like', '%' . $request->specialty . '%')
                  ->orWhere('specialty_ar', 'like', '%' . $request->specialty . '%');
        }

        // التصفية حسب الحالة
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // التصفية حسب الجنس
        if ($request->has('gender')) {
            $query->where('gender', $request->gender);
        }

        // الترتيب حسب التقييم
        if ($request->has('sort_by_rating')) {
            $query->orderBy('rating', 'desc');
        }

        $therapists = $query->paginate(10);

        return response()->json([
            'data' => TherapistResource::collection($therapists),
            'meta' => [
                'current_page' => $therapists->currentPage(),
                'total' => $therapists->total(),
                'per_page' => $therapists->perPage(),
            ]
        ]);
    }

    /**
     * تخزين معالج جديد
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'name_ar' => 'required|string|max:255',
            'name_en' => 'required|string|max:255',
            'title_ar' => 'required|string|max:255',
            'title_en' => 'required|string|max:255',
            'methodologies_ar' => 'nullable|array',
            'methodologies_en' => 'nullable|array',
            'specialty_ar' => 'required|string|max:255',
            'specialty_en' => 'required|string|max:255',
            'session_duration' => 'integer|min:1',
            'experience' => 'integer|min:0',
            'hourly_rate' => 'nullable|numeric|min:0',
            'phone' => 'nullable|string|max:20',
            'date_of_birth' => 'nullable|date',
            'gender' => 'nullable|in:male,female',
            'bio_ar' => 'nullable|string',
            'bio_en' => 'nullable|string',
            'status' => 'in:active,busy,away'
        ]);

        $therapist = Therapist::create($validated);

        return response()->json([
            'message' => 'Therapist created successfully',
            'data' => new TherapistResource($therapist->load(['qualifications', 'certifications', 'schedules']))
        ], 201);
    }

    /**
     * عرض معالج محدد
     */
    public function show(Therapist $therapist): JsonResponse
    {
        $therapist->load(['qualifications', 'certifications', 'schedules']);
        
        return response()->json([
            'data' => new TherapistResource($therapist)
        ]);
    }

    /**
     * تحديث المعالج
     */
    public function update(Request $request, Therapist $therapist): JsonResponse
    {
        $validated = $request->validate([
            'name_ar' => 'sometimes|string|max:255',
            'name_en' => 'sometimes|string|max:255',
            'title_ar' => 'sometimes|string|max:255',
            'title_en' => 'sometimes|string|max:255',
            'methodologies_ar' => 'nullable|array',
            'methodologies_en' => 'nullable|array',
            'specialty_ar' => 'sometimes|string|max:255',
            'specialty_en' => 'sometimes|string|max:255',
            'session_duration' => 'sometimes|integer|min:1',
            'experience' => 'sometimes|integer|min:0',
            'hourly_rate' => 'nullable|numeric|min:0',
            'phone' => 'nullable|string|max:20',
            'date_of_birth' => 'nullable|date',
            'gender' => 'nullable|in:male,female',
            'bio_ar' => 'nullable|string',
            'bio_en' => 'nullable|string',
            'status' => 'sometimes|in:active,busy,away'
        ]);

        $therapist->update($validated);

        return response()->json([
            'message' => 'Therapist updated successfully',
            'data' => new TherapistResource($therapist->fresh(['qualifications', 'certifications', 'schedules']))
        ]);
    }

    /**
     * حذف المعالج
     */
    public function destroy(Therapist $therapist): JsonResponse
    {
        $therapist->delete();

        return response()->json([
            'message' => 'Therapist deleted successfully'
        ]);
    }
}
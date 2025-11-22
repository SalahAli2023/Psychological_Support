<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TherapistCertificationResource;
use App\Models\Therapist;
use App\Models\TherapistCertification;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class TherapistCertificationController extends Controller
{
    /**
     * عرض شهادات المعالج
     */
    public function index(Therapist $therapist): JsonResponse
    {
        $certifications = $therapist->certifications()->orderBy('year_obtained', 'desc')->get();

        return response()->json([
            'data' => TherapistCertificationResource::collection($certifications)
        ]);
    }

    /**
     * تخزين شهادة جديدة
     */
    public function store(Request $request, Therapist $therapist): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'issuing_authority' => 'nullable|string|max:255',
            'year_obtained' => 'nullable|integer|min:1900|max:' . date('Y')
        ]);

        try {
            $certification = $therapist->certifications()->create($validated);

            return response()->json([
                'message' => 'Certification added successfully',
                'data' => new TherapistCertificationResource($certification)
            ], 201);

        } catch (\Exception $e) {
            Log::error('Error creating therapist certification: ' . $e->getMessage(), [
                'therapist_id' => $therapist->id,
                'error' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Error creating certification: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * تحديث الشهادة
     */
    public function update(Request $request, Therapist $therapist, TherapistCertification $certification): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'issuing_authority' => 'nullable|string|max:255',
            'year_obtained' => 'nullable|integer|min:1900|max:' . date('Y')
        ]);

        try {
            $certification->update($validated);

            return response()->json([
                'message' => 'Certification updated successfully',
                'data' => new TherapistCertificationResource($certification)
            ]);

        } catch (\Exception $e) {
            Log::error('Error updating therapist certification: ' . $e->getMessage(), [
                'certification_id' => $certification->id,
                'error' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Error updating certification: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * حذف الشهادة
     */
    public function destroy(Therapist $therapist, TherapistCertification $certification): JsonResponse
    {
        try {
            $certification->delete();

            return response()->json([
                'message' => 'Certification deleted successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Error deleting therapist certification: ' . $e->getMessage(), [
                'certification_id' => $certification->id,
                'error' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Error deleting certification: ' . $e->getMessage()
            ], 500);
        }
    }
}
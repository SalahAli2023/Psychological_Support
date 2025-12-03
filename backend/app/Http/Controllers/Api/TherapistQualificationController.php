<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TherapistQualificationResource;
use App\Models\Therapist;
use App\Models\TherapistQualification;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class TherapistQualificationController extends Controller
{
    /**
     * عرض مؤهلات المعالج
     */
    public function index($therapistId): JsonResponse
    {
        try {
            $therapist = Therapist::find($therapistId);
            
            if (!$therapist) {
                return response()->json([
                    'success' => false,
                    'message' => 'Therapist not found'
                ], 404);
            }

            $qualifications = $therapist->qualifications()->orderBy('year', 'desc')->get();

            return response()->json([
                'success' => true,
                'data' => TherapistQualificationResource::collection($qualifications)
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching therapist qualifications: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error fetching qualifications'
            ], 500);
        }
    }

    /**
     * تخزين مؤهل جديد
     */
    public function store(Request $request, $therapistId): JsonResponse
    {
        DB::beginTransaction();
        
        try {
            $therapist = Therapist::find($therapistId);
            
            if (!$therapist) {
                return response()->json([
                    'success' => false,
                    'message' => 'Therapist not found'
                ], 404);
            }

            $validated = $request->validate([
                'name_ar' => 'required|string|max:255',
                'name_en' => 'required|string|max:255',
                'institution_ar' => 'required|string|max:255',
                'institution_en' => 'required|string|max:255',
                'year' => 'nullable|integer|min:1900|max:' . date('Y')
            ]);

            $qualification = $therapist->qualifications()->create($validated);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Qualification added successfully',
                'data' => new TherapistQualificationResource($qualification)
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error creating therapist qualification: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error creating qualification: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * تحديث المؤهل - الإصدار المصحح
     */
    public function update(Request $request, $therapistId, $qualificationId): JsonResponse
    {
        DB::beginTransaction();
        
        try {
            // البحث عن المؤهل مباشرة أولاً
            $qualification = TherapistQualification::find($qualificationId);
            
            if (!$qualification) {
                return response()->json([
                    'success' => false,
                    'message' => 'Qualification not found'
                ], 404);
            }

            // التحقق أن المؤهل يخص المعالج الصحيح
            if ($qualification->therapist_id != $therapistId) {
                return response()->json([
                    'success' => false,
                    'message' => 'Qualification does not belong to this therapist'
                ], 404);
            }

            $validated = $request->validate([
                'name_ar' => 'sometimes|string|max:255',
                'name_en' => 'sometimes|string|max:255',
                'institution_ar' => 'sometimes|string|max:255',
                'institution_en' => 'sometimes|string|max:255',
                'year' => 'nullable|integer|min:1900|max:' . date('Y')
            ]);

            $qualification->update($validated);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Qualification updated successfully',
                'data' => new TherapistQualificationResource($qualification)
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error updating therapist qualification: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error updating qualification: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * حذف المؤهل - الإصدار المصحح
     */
    public function destroy($therapistId, $qualificationId): JsonResponse
    {
        DB::beginTransaction();
        
        try {
            // البحث عن المؤهل مباشرة أولاً
            $qualification = TherapistQualification::find($qualificationId);
            
            if (!$qualification) {
                return response()->json([
                    'success' => false,
                    'message' => 'Qualification not found'
                ], 404);
            }

            // التحقق أن المؤهل يخص المعالج الصحيح
            if ($qualification->therapist_id != $therapistId) {
                return response()->json([
                    'success' => false,
                    'message' => 'Qualification does not belong to this therapist'
                ], 404);
            }

            $qualification->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Qualification deleted successfully'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error deleting therapist qualification: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error deleting qualification: ' . $e->getMessage()
            ], 500);
        }
    }
}
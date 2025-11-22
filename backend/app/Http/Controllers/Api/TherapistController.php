<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TherapistResource;
use App\Models\Therapist;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class TherapistController extends Controller
{
    /**
     * عرض قائمة المعالجين
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Therapist::with(['user', 'qualifications', 'certifications', 'schedules']);

            // التصفية حسب التخصص
            if ($request->has('specialty') && $request->specialty) {
                $specialty = $request->specialty;
                $query->where(function($q) use ($specialty) {
                    $q->where('specialty_en', 'like', '%' . $specialty . '%')
                      ->orWhere('specialty_ar', 'like', '%' . $specialty . '%');
                });
            }

            // التصفية حسب الحالة
            if ($request->has('status') && $request->status) {
                $query->where('status', $request->status);
            }

            // التصفية حسب الجنس
            if ($request->has('gender') && $request->gender) {
                $query->where('gender', $request->gender);
            }

            // الترتيب حسب التقييم
            if ($request->has('sort_by_rating') && $request->sort_by_rating) {
                $query->orderBy('rating', 'desc');
            } else {
                $query->orderBy('created_at', 'desc');
            }

            $perPage = $request->get('per_page', 10);
            $therapists = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => TherapistResource::collection($therapists),
                'meta' => [
                    'current_page' => $therapists->currentPage(),
                    'total' => $therapists->total(),
                    'per_page' => $therapists->perPage(),
                    'last_page' => $therapists->lastPage(),
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching therapists: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error fetching therapists'
            ], 500);
        }
    }

    /**
     * عرض معالج محدد
     */
    public function show($id): JsonResponse
    {
        try {
            $therapist = Therapist::with(['user', 'qualifications', 'certifications', 'schedules'])->find($id);
            
            if (!$therapist) {
                return response()->json([
                    'success' => false,
                    'message' => 'Therapist not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => new TherapistResource($therapist)
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching therapist: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error fetching therapist'
            ], 500);
        }
    }

    /**
     * تخزين معالج جديد
     */
    public function store(Request $request): JsonResponse
    {
        DB::beginTransaction();
        
        try {
            $validated = $request->validate([
                'name_ar' => 'required|string|max:255',
                'name_en' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email',
                'password' => 'required|string|min:6',
                'phone' => 'required|string|max:20',
                'title_ar' => 'required|string|max:255',
                'title_en' => 'required|string|max:255',
                'methodologies_ar' => 'nullable|array',
                'methodologies_en' => 'nullable|array',
                'specialty_ar' => 'required|string|max:255',
                'specialty_en' => 'required|string|max:255',
                'session_duration' => 'required|integer|min:1',
                'experience' => 'required|integer|min:0',
                'hourly_rate' => 'nullable|numeric|min:0',
                'date_of_birth' => 'nullable|date',
                'gender' => 'required|in:male,female',
                'bio_ar' => 'nullable|string',
                'bio_en' => 'nullable|string',
                'status' => 'required|in:active,busy,away'
            ]);

            // إنشاء المستخدم أولاً
            $user = User::create([
                'name' => $validated['name_en'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role' => 'therapist',
                'phone' => $validated['phone'],
                'joined_at' => now(),
            ]);

            // إنشاء المعالج مرتبط بالمستخدم
            $therapistData = [
                'user_id' => $user->id,
                'name_ar' => $validated['name_ar'],
                'name_en' => $validated['name_en'],
                'title_ar' => $validated['title_ar'],
                'title_en' => $validated['title_en'],
                'methodologies_ar' => $validated['methodologies_ar'] ?? [],
                'methodologies_en' => $validated['methodologies_en'] ?? [],
                'specialty_ar' => $validated['specialty_ar'],
                'specialty_en' => $validated['specialty_en'],
                'session_duration' => $validated['session_duration'],
                'experience' => $validated['experience'],
                'hourly_rate' => $validated['hourly_rate'] ?? 0,
                'date_of_birth' => $validated['date_of_birth'] ?? null,
                'gender' => $validated['gender'],
                'bio_ar' => $validated['bio_ar'] ?? null,
                'bio_en' => $validated['bio_en'] ?? null,
                'status' => $validated['status'],
                'total_sessions' => 0,
                'rating' => 0,
                'rating_count' => 0,
            ];

            $therapist = Therapist::create($therapistData);
            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Therapist created successfully',
                'data' => new TherapistResource($therapist->load(['user', 'qualifications', 'certifications', 'schedules']))
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error creating therapist: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error creating therapist: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * تحديث المعالج
     */
    public function update(Request $request, $id): JsonResponse
    {
        DB::beginTransaction();
        
        try {
            $therapist = Therapist::with('user')->find($id);
            
            if (!$therapist) {
                return response()->json([
                    'success' => false,
                    'message' => 'Therapist not found'
                ], 404);
            }

            $validated = $request->validate([
                'name_ar' => 'sometimes|string|max:255',
                'name_en' => 'sometimes|string|max:255',
                'email' => 'sometimes|email|unique:users,email,' . $therapist->user_id,
                'password' => 'nullable|string|min:6',
                'phone' => 'sometimes|string|max:20',
                'title_ar' => 'sometimes|string|max:255',
                'title_en' => 'sometimes|string|max:255',
                'methodologies_ar' => 'nullable|array',
                'methodologies_en' => 'nullable|array',
                'specialty_ar' => 'sometimes|string|max:255',
                'specialty_en' => 'sometimes|string|max:255',
                'session_duration' => 'sometimes|integer|min:1',
                'experience' => 'sometimes|integer|min:0',
                'hourly_rate' => 'nullable|numeric|min:0',
                'date_of_birth' => 'nullable|date',
                'gender' => 'sometimes|in:male,female',
                'bio_ar' => 'nullable|string',
                'bio_en' => 'nullable|string',
                'status' => 'sometimes|in:active,busy,away'
            ]);

            // تحديث بيانات المستخدم
            if ($therapist->user) {
                $userData = [];
                
                if (isset($validated['name_en'])) {
                    $userData['name'] = $validated['name_en'];
                }
                if (isset($validated['phone'])) {
                    $userData['phone'] = $validated['phone'];
                }
                if (isset($validated['email'])) {
                    $userData['email'] = $validated['email'];
                }
                if (isset($validated['password']) && !empty($validated['password'])) {
                    $userData['password'] = Hash::make($validated['password']);
                }

                if (!empty($userData)) {
                    $therapist->user->update($userData);
                }
            }

            // إعداد بيانات المعالج للتحديث
            $therapistData = $validated;
            unset($therapistData['email'], $therapistData['password'], $therapistData['phone']);

            // تحديث بيانات المعالج
            $therapist->update($therapistData);

            DB::commit();

            // إعادة تحميل البيانات المحدثة
            $updatedTherapist = Therapist::with(['user', 'qualifications', 'certifications', 'schedules'])->find($id);

            return response()->json([
                'success' => true,
                'message' => 'Therapist updated successfully',
                'data' => new TherapistResource($updatedTherapist)
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error updating therapist: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error updating therapist: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * حذف المعالج
     */
    public function destroy($id): JsonResponse
    {
        DB::beginTransaction();
        
        try {
            $therapist = Therapist::with('user')->find($id);
            
            if (!$therapist) {
                return response()->json([
                    'success' => false,
                    'message' => 'Therapist not found'
                ], 404);
            }

            // حذف المستخدم المرتبط أولاً
            if ($therapist->user) {
                $therapist->user->delete();
            }
            
            // حذف المعالج
            $therapist->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Therapist deleted successfully'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error deleting therapist: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error deleting therapist: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * الحصول على التخصصات المتاحة
     */
    public function specializations(): JsonResponse
    {
        try {
            $specializationsAr = Therapist::distinct()->whereNotNull('specialty_ar')->pluck('specialty_ar')->filter()->values();
            $specializationsEn = Therapist::distinct()->whereNotNull('specialty_en')->pluck('specialty_en')->filter()->values();

            return response()->json([
                'success' => true,
                'data' => [
                    'ar' => $specializationsAr,
                    'en' => $specializationsEn
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching specializations: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error fetching specializations'
            ], 500);
        }
    }
}
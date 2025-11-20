<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TherapistResource;
use App\Models\Therapist;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;

class TherapistController extends Controller
{
/**
 * عرض قائمة المعالجين
 */
public function index(Request $request): JsonResponse
{
    $query = Therapist::with(['user', 'qualifications', 'certifications', 'schedules']);

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
 * عرض معالج محدد
 */
    public function show(Therapist $therapist): JsonResponse
    {
        // تحميل العلاقات مع التحقق من وجودها
        $therapist->load(['user', 'qualifications', 'certifications', 'schedules']);
        
        return response()->json([
            'data' => new TherapistResource($therapist)
        ]);
    }
    /**
     * تخزين معالج جديد
     */
        public function store(Request $request): JsonResponse
    {
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
            'session_duration' => 'integer|min:1',
            'experience' => 'integer|min:0',
            'hourly_rate' => 'nullable|numeric|min:0',
            'date_of_birth' => 'nullable|date',
            'gender' => 'nullable|in:male,female',
            'bio_ar' => 'nullable|string',
            'bio_en' => 'nullable|string',
            'status' => 'in:active,busy,away'
        ]);

        // إنشاء المستخدم أولاً
        $user = User::create([
            'name' => $validated['name_en'], // أو name_ar حسب التفضيل
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'Therapist',
            'phone' => $validated['phone'],
            'joined_at' => now(),
        ]);

        // إنشاء المعالج مرتبط بالمستخدم
        $therapistData = array_merge($validated, ['user_id' => $user->id]);
        unset($therapistData['email'], $therapistData['password']); // إزالة بيانات المستخدم

        $therapist = Therapist::create($therapistData);

        return response()->json([
            'message' => 'Therapist created successfully',
            'data' => new TherapistResource($therapist->load(['qualifications', 'certifications', 'schedules']))
        ], 201);
    }

  /**
 * تحديث المعالج
 */
public function update(Request $request, Therapist $therapist): JsonResponse
{
    try {
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
            'gender' => 'nullable|in:male,female',
            'bio_ar' => 'nullable|string',
            'bio_en' => 'nullable|string',
            'status' => 'sometimes|in:active,busy,away'
        ]);

        // تحديث بيانات المستخدم
        if ($therapist->user) {
            $userData = [
                'name' => $validated['name_en'] ?? $therapist->user->name,
                'phone' => $validated['phone'] ?? $therapist->user->phone,
            ];

            if (isset($validated['email'])) {
                $userData['email'] = $validated['email'];
            }

            if (isset($validated['password']) && !empty($validated['password'])) {
                $userData['password'] = Hash::make($validated['password']);
            }

            $therapist->user->update($userData);
        }

        // إزالة بيانات المستخدم من بيانات المعالج
        $therapistData = $validated;
        unset($therapistData['email'], $therapistData['password'], $therapistData['phone']);

        $therapist->update($therapistData);

        // إعادة تحميل العلاقات قبل إرجاع البيانات
        $therapist->load(['user', 'qualifications', 'certifications', 'schedules']);

        return response()->json([
            'message' => 'Therapist updated successfully',
            'data' => new TherapistResource($therapist)
        ]);

    } catch (\Exception $e) {
        \Log::error('Error updating therapist: ' . $e->getMessage(), [
            'therapist_id' => $therapist->id,
            'error' => $e->getTraceAsString()
        ]);

        return response()->json([
            'message' => 'Error updating therapist: ' . $e->getMessage()
        ], 500);
    }
}
    /**
     * حذف المعالج
     */
    public function destroy(Therapist $therapist): JsonResponse
    {
        // حذف المستخدم المرتبط أولاً
        if ($therapist->user) {
            $therapist->user->delete();
        }
        
        $therapist->delete();

        return response()->json([
            'message' => 'Therapist deleted successfully'
        ]);
    }
}
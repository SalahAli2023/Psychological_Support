<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Http\Resources\UserResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    /**
     * عرض قائمة المستخدمين مع إمكانية البحث والتصفية
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = User::query();
            
            // البحث بالاسم أو البريد الإلكتروني أو الهاتف
            if ($request->has('search') && $request->search) {
                $searchTerm = $request->search;
                $query->where(function($q) use ($searchTerm) {
                    $q->where('name', 'like', "%{$searchTerm}%")
                      ->orWhere('email', 'like', "%{$searchTerm}%")
                      ->orWhere('phone', 'like', "%{$searchTerm}%");
                });
            }
            
            // التصفية حسب الدور
            if ($request->has('role') && $request->role) {
                $query->where('role', $request->role);
            }

            // التصفية حسب تاريخ الانضمام
            if ($request->has('joined_from') && $request->joined_from) {
                $query->where('joined_at', '>=', $request->joined_from);
            }

            if ($request->has('joined_to') && $request->joined_to) {
                $query->where('joined_at', '<=', $request->joined_to);
            }
            
            // الترتيب
            $sortField = $request->get('sort_by', 'created_at');
            $sortDirection = $request->get('sort_order', 'desc');
            $allowedSortFields = ['name', 'email', 'role', 'joined_at', 'created_at'];
            $sortField = in_array($sortField, $allowedSortFields) ? $sortField : 'created_at';
            $sortDirection = $sortDirection === 'asc' ? 'asc' : 'desc';
            
            $query->orderBy($sortField, $sortDirection);
            
            // التقسيم (Pagination)
            $perPage = $request->get('per_page', 15);
            $users = $query->paginate($perPage);
            
            return response()->json([
                'success' => true,
                'data' => UserResource::collection($users),
                'meta' => [
                    'total' => $users->total(),
                    'per_page' => $users->perPage(),
                    'current_page' => $users->currentPage(),
                    'last_page' => $users->lastPage(),
                    'from' => $users->firstItem(),
                    'to' => $users->lastItem(),
                ]
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch users',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * إنشاء مستخدم جديد
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email',
                'password' => 'required|string|min:8',
                'role' => ['required', Rule::in(['Admin', 'Therapist', 'Client'])],
                'phone' => 'nullable|string|max:20',
                'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
                'bio' => 'nullable|string|max:1000',
                'joined_at' => 'nullable|date',
            ]);

            $avatarPath = null;
            if ($request->hasFile('avatar')) {
                $avatarPath = $request->file('avatar')->store('avatars', 'public');
            }

            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role' => $validated['role'],
                'phone' => $validated['phone'] ?? null,
                'avatar' => $avatarPath,
                'bio' => $validated['bio'] ?? null,
                'joined_at' => $validated['joined_at'] ?? now(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'User created successfully',
                'data' => new UserResource($user)
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create user',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * عرض مستخدم محدد
     */
    public function show(User $user): JsonResponse
    {
        try {
            return response()->json([
                'success' => true,
                'data' => new UserResource($user)
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch user',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * تحديث مستخدم
     */
   public function update(Request $request, User $user): JsonResponse
{
    try {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => ['sometimes', 'required', 'email', Rule::unique('users')->ignore($user->id)],
            'password' => 'sometimes|nullable|string|min:8',
            'role' => ['sometimes', 'required', Rule::in(['Admin', 'Therapist', 'Client'])],
            'phone' => 'nullable|string|max:20',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'bio' => 'nullable|string|max:1000',
            'joined_at' => 'nullable|date',
            'remove_avatar' => 'sometimes|boolean',
        ]);

        $updateData = [
            'name' => $validated['name'] ?? $user->name,
            'email' => $validated['email'] ?? $user->email,
            'role' => $validated['role'] ?? $user->role,
            'phone' => $validated['phone'] ?? $user->phone,
            'bio' => $validated['bio'] ?? $user->bio,
            'joined_at' => $validated['joined_at'] ?? $user->joined_at,
        ];

        // تحديث كلمة المرور فقط إذا تم تقديمها
        if (isset($validated['password']) && $validated['password']) {
            $updateData['password'] = Hash::make($validated['password']);
        }

        // تحديث الصورة الشخصية إذا تم تقديمها
        if ($request->hasFile('avatar')) {
            // حذف الصورة القديمة إذا كانت موجودة
            if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
                Storage::disk('public')->delete($user->avatar);
            }
            $updateData['avatar'] = $request->file('avatar')->store('avatars', 'public');
        }

        // حذف الصورة الشخصية إذا طلب المستخدم ذلك
        if (isset($validated['remove_avatar']) && $validated['remove_avatar']) {
            if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
                Storage::disk('public')->delete($user->avatar);
            }
            $updateData['avatar'] = null;
        }

        $user->update($updateData);

        return response()->json([
            'success' => true,
            'message' => 'User updated successfully',
            'data' => new UserResource($user)
        ]);

    } catch (\Illuminate\Validation\ValidationException $e) {
        return response()->json([
            'success' => false,
            'message' => 'Validation failed',
            'errors' => $e->errors()
        ], 422);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Failed to update user',
            'error' => $e->getMessage()
        ], 500);
    }
}

    /**
     * حذف مستخدم
     */
    public function destroy(User $user): JsonResponse
    {
        try {
            // منع حذف المستخدم الحالي
            if ($user->id === auth()->id()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot delete your own account'
                ], 422);
            }

            // حذف الصورة الشخصية إذا كانت موجودة
            if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
                Storage::disk('public')->delete($user->avatar);
            }

            $user->delete();

            return response()->json([
                'success' => true,
                'message' => 'User deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete user',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * إحصائيات المستخدمين
     */
    public function stats(): JsonResponse
    {
        try {
            $totalUsers = User::count();
            $totalClients = User::where('role', 'Client')->count();
            $totalTherapists = User::where('role', 'Therapist')->count();
            $totalAdmins = User::where('role', 'Admin')->count();
            
            // المستخدمين الجدد (آخر 7 أيام)
            $newUsersLast7Days = User::where('created_at', '>=', now()->subDays(7))->count();
            
            // المستخدمين الجدد هذا الشهر
            $newUsersThisMonth = User::where('created_at', '>=', now()->startOfMonth())->count();
            
            // المستخدمين الذين انضموا هذا الشهر
            $joinedThisMonth = User::where('joined_at', '>=', now()->startOfMonth())->count();
            
            return response()->json([
                'success' => true,
                'data' => [
                    'total_users' => $totalUsers,
                    'total_clients' => $totalClients,
                    'total_therapists' => $totalTherapists,
                    'total_admins' => $totalAdmins,
                    'new_users_last_7_days' => $newUsersLast7Days,
                    'new_users_this_month' => $newUsersThisMonth,
                    'joined_this_month' => $joinedThisMonth,
                ]
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch user statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
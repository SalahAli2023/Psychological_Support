<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Http\Resources\UserResource;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{
    /**
     * عرض قائمة المستخدمين مع إمكانية البحث والتصفية
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = User::query();
            
            // البحث بالاسم أو البريد الإلكتروني
            if ($request->has('q') && $request->q) {
                $searchTerm = $request->q;
                $query->where(function($q) use ($searchTerm) {
                    $q->where('name', 'like', "%{$searchTerm}%")
                        ->orWhere('email', 'like', "%{$searchTerm}%");
                });
            }
            
            // التصفية حسب الدور
            if ($request->has('role') && $request->role) {
                $query->where('role', $request->role);
            }
            
            // الترتيب حسب أحدث المستخدمين
            $query->orderBy('created_at', 'desc');
            
            $users = $query->get();
            
            return response()->json([
                'success' => true,
                'data' => UserResource::collection($users),
                'total' => $users->count()
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
            $newUsers = User::where('created_at', '>=', now()->subDays(7))->count();
            
            return response()->json([
                'success' => true,
                'data' => [
                    'total_users' => $totalUsers,
                    'total_clients' => $totalClients,
                    'total_therapists' => $totalTherapists,
                    'total_admins' => $totalAdmins,
                    'new_users' => $newUsers,
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

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\User;
use App\Models\Article;
use App\Models\Event;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Get dashboard statistics.
     */
    public function stats(Request $request)
    {
        $user = $request->user();

        // Only admins can access dashboard stats
        if (!$user->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $stats = [
            'total_users' => User::count(),
            'total_clients' => User::where('role', 'Client')->count(),
            'total_therapists' => User::where('role', 'Therapist')->count(),
            'total_articles' => Article::count(),
            'published_articles' => Article::where('is_published', true)->count(),
            'total_events' => Event::count(),
            'upcoming_appointments' => Appointment::where('status', 'scheduled')
                ->where('starts_at', '>', now())
                ->count(),
            'total_appointments' => Appointment::count(),
            'new_users_this_month' => User::whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->count(),
        ];

        return response()->json($stats);
    }
}

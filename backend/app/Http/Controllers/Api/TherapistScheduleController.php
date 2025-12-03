<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TherapistScheduleResource;
use App\Models\Therapist;
use App\Models\TherapistSchedule;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class TherapistScheduleController extends Controller
{
    /**
     * عرض جدول المعالج
     */
    public function index(Therapist $therapist): JsonResponse
    {
        $schedules = $therapist->schedules()->orderBy('day')->orderBy('start_time')->get();

        return response()->json([
            'data' => TherapistScheduleResource::collection($schedules)
        ]);
    }

    /**
     * تخزين موعد جديد
     */
    public function store(Request $request, Therapist $therapist): JsonResponse
    {
        $validated = $request->validate([
            'day' => 'required|in:saturday,sunday,monday,tuesday,wednesday,thursday,friday',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'available' => 'boolean',
            'recurrence' => 'sometimes|in:weekly,biweekly,monthly',
            'slot_duration' => 'sometimes|integer|min:1'
        ]);

        try {
            // التحقق من عدم وجود تداخل في المواعيد
            $conflictingSchedule = $therapist->schedules()
                ->where('day', $validated['day'])
                ->where(function ($query) use ($validated) {
                    $query->whereBetween('start_time', [$validated['start_time'], $validated['end_time']])
                          ->orWhereBetween('end_time', [$validated['start_time'], $validated['end_time']])
                          ->orWhere(function ($q) use ($validated) {
                              $q->where('start_time', '<=', $validated['start_time'])
                                ->where('end_time', '>=', $validated['end_time']);
                          });
                })
                ->first();

            if ($conflictingSchedule) {
                return response()->json([
                    'message' => 'Schedule conflict detected'
                ], 422);
            }

            $schedule = $therapist->schedules()->create($validated);

            return response()->json([
                'message' => 'Schedule added successfully',
                'data' => new TherapistScheduleResource($schedule)
            ], 201);

        } catch (\Exception $e) {
            Log::error('Error creating therapist schedule: ' . $e->getMessage(), [
                'therapist_id' => $therapist->id,
                'error' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Error creating schedule: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * تحديث الموعد
     */
    public function update(Request $request, Therapist $therapist, TherapistSchedule $schedule): JsonResponse
    {
        $validated = $request->validate([
            'day' => 'sometimes|in:saturday,sunday,monday,tuesday,wednesday,thursday,friday',
            'start_time' => 'sometimes|date_format:H:i',
            'end_time' => 'sometimes|date_format:H:i|after:start_time',
            'available' => 'boolean',
            'recurrence' => 'sometimes|in:weekly,biweekly,monthly',
            'slot_duration' => 'sometimes|integer|min:1'
        ]);

        try {
            // التحقق من عدم وجود تداخل في المواعيد (استثناء الجدول الحالي)
            if (isset($validated['day']) || isset($validated['start_time']) || isset($validated['end_time'])) {
                $conflictingSchedule = $therapist->schedules()
                    ->where('id', '!=', $schedule->id)
                    ->where('day', $validated['day'] ?? $schedule->day)
                    ->where(function ($query) use ($validated, $schedule) {
                        $startTime = $validated['start_time'] ?? $schedule->start_time;
                        $endTime = $validated['end_time'] ?? $schedule->end_time;
                        
                        $query->whereBetween('start_time', [$startTime, $endTime])
                              ->orWhereBetween('end_time', [$startTime, $endTime])
                              ->orWhere(function ($q) use ($startTime, $endTime) {
                                  $q->where('start_time', '<=', $startTime)
                                    ->where('end_time', '>=', $endTime);
                              });
                    })
                    ->first();

                if ($conflictingSchedule) {
                    return response()->json([
                        'message' => 'Schedule conflict detected'
                    ], 422);
                }
            }

            $schedule->update($validated);

            return response()->json([
                'message' => 'Schedule updated successfully',
                'data' => new TherapistScheduleResource($schedule)
            ]);

        } catch (\Exception $e) {
            Log::error('Error updating therapist schedule: ' . $e->getMessage(), [
                'schedule_id' => $schedule->id,
                'error' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Error updating schedule: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * حذف الموعد
     */
    public function destroy(Therapist $therapist, TherapistSchedule $schedule): JsonResponse
    {
        try {
            $schedule->delete();

            return response()->json([
                'message' => 'Schedule deleted successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Error deleting therapist schedule: ' . $e->getMessage(), [
                'schedule_id' => $schedule->id,
                'error' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Error deleting schedule: ' . $e->getMessage()
            ], 500);
        }
    }
}
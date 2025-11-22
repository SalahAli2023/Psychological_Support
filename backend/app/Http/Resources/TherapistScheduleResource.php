<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TherapistScheduleResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'therapist_id' => $this->therapist_id,
            'day' => $this->day,
            'start_time' => $this->start_time, // ✅ إزالة format() لأنها string
            'end_time' => $this->end_time, // ✅ إزالة format() لأنها string
            'available' => $this->available,
            'is_available' => (bool) $this->available,
            'recurrence' => $this->recurrence,
            'slot_duration' => $this->slot_duration,
            'session_duration' => $this->slot_duration ?? optional($this->therapist)->session_duration ?? 60,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
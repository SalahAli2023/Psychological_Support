<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TherapistResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'name_ar' => $this->name_ar,
            'name_en' => $this->name_en,
            'title_ar' => $this->title_ar,
            'title_en' => $this->title_en,
            'methodologies_ar' => $this->methodologies_ar ?? [],
            'methodologies_en' => $this->methodologies_en ?? [],
            'specialty_ar' => $this->specialty_ar,
            'specialty_en' => $this->specialty_en,
            'session_duration' => $this->session_duration,
            'experience' => $this->experience,
            'total_sessions' => $this->total_sessions,
            'hourly_rate' => $this->hourly_rate,
            'phone' => $this->phone,
            'date_of_birth' => $this->date_of_birth,
            'gender' => $this->gender,
            'rating' => $this->rating,
            'rating_count' => $this->rating_count,
            'bio_ar' => $this->bio_ar,
            'bio_en' => $this->bio_en,
            'status' => $this->status,
            'email' => $this->user->email ?? null,
            'user' => $this->whenLoaded('user'),
            'qualifications' => TherapistQualificationResource::collection($this->whenLoaded('qualifications')),
            'certifications' => TherapistCertificationResource::collection($this->whenLoaded('certifications')),
            'schedules' => TherapistScheduleResource::collection($this->whenLoaded('schedules')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
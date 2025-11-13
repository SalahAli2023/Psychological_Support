<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AssessmentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'scale_id' => $this->scale_id,
            'total_score' => $this->total_score,
            'interpretation_level' => $this->interpretation_level,
            'assessment_data' => $this->assessment_data,
            'scale' => new PsychologicalScaleResource($this->whenLoaded('psychologicalScale')),
            'completed_at' => $this->completed_at,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}

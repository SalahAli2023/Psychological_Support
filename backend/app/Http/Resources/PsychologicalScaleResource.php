<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PsychologicalScaleResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'category_id' => $this->category_id,
            'name' => $this->name,
            'name_ar' => $this->name_ar,
            'name_en' => $this->name_en,
            'description' => $this->description,
            'description_ar' => $this->description_ar,
            'description_en' => $this->description_en,
            'image_url' => $this->image_url,
            'max_score' => $this->max_score,
            'is_active' => $this->is_active,
            'category' => $this->whenLoaded('category'),
            'questions' => ScaleQuestionResource::collection($this->whenLoaded('questions')),
            'interpretations' => ResultInterpretationResource::collection($this->whenLoaded('interpretations')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
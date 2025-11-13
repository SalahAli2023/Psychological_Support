<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PsychologicalScaleWithQuestionsResource extends JsonResource
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
            'name' => $this->name,
            'name_ar' => $this->name_ar,
            'name_en' => $this->name_en,
            'description' => $this->description,
            'description_ar' => $this->description_ar,
            'description_en' => $this->description_en,
            'image_url' => $this->image_url,
            'max_score' => $this->max_score,
            'category' => new ScaleCategoryResource($this->whenLoaded('category')),
            'questions' => ScaleQuestionResource::collection($this->whenLoaded('questions')),
            'interpretations' => $this->whenLoaded('interpretations', function () {
                return $this->interpretations->map(function ($interpretation) {
                    return [
                        'id' => $interpretation->id,
                        'min_score' => $interpretation->min_score,
                        'max_score' => $interpretation->max_score,
                        'interpretation_label' => $interpretation->interpretation_label,
                        'interpretation_label_ar' => $interpretation->interpretation_label_ar,
                        'interpretation_label_en' => $interpretation->interpretation_label_en,
                        'description' => $interpretation->description,
                        'description_ar' => $interpretation->description_ar,
                        'description_en' => $interpretation->description_en,
                        'color' => $interpretation->color,
                    ];
                });
            }),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}

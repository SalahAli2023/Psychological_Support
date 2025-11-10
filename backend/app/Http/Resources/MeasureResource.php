<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MeasureResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $locale = $request->query('locale') ?? $request->header('Accept-Language', 'en');
        $locale = in_array($locale, ['ar', 'en']) ? $locale : 'en';

        return [
            'id' => $this->id,
            'key' => $this->key,
            'title' => $locale === 'ar' ? $this->title_ar : $this->title_en,
            'title_ar' => $this->title_ar,
            'title_en' => $this->title_en,
            'description' => $locale === 'ar' ? $this->description_ar : $this->description_en,
            'description_ar' => $this->description_ar,
            'description_en' => $this->description_en,
            'category' => $this->category,
            'icon' => $this->icon,
            'questions_count' => $this->questions_count,
            'time_required' => $this->time_required,
            'rating' => (float) $this->rating,
            'reviews_count' => $this->reviews_count,
            'options' => $this->options,
            'scores' => $this->scores,
            'interpretation_rules' => $this->interpretation_rules,
            'is_active' => $this->is_active,
            'questions' => MeasureQuestionResource::collection($this->whenLoaded('questions')),
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}
